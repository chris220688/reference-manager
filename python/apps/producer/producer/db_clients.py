from abc import ABC, abstractmethod
from typing import List

from motor.motor_asyncio import (
	AsyncIOMotorClient,
	AsyncIOMotorClientSession,
)
from pymongo.errors import ServerSelectionTimeoutError

from contextlog import contextlog
from producer import config
from producer.exceptions import (
	DatabaseConnectionError,
	UnknownDatabaseType,
)
from producer.models import (
	Reference,
	ReferenceMetadata,
)


logger = contextlog.get_contextlog()

async def get_db_client(db_type):
	""" Works out the correct database client based on
		the database type provided in the configuration

		Raises:
			producer.exceptions.UnknownDatabaseType
	"""
	for client_cls in DatabaseClient.__subclasses__():
		try:
			if await client_cls.meets_condition(db_type):
				return client_cls()
		except KeyError:
			continue

	raise UnknownDatabaseType(db_type)


class DatabaseClient(ABC):
	""" Database client interface """

	@abstractmethod
	async def meets_condition(self):
		""" Checks whether this type of database client matches
			the one defined in the configuration.

			Makes sure the correct client will be instantiated.
		"""
		...

	@abstractmethod
	async def close_connection(self):
		""" Closes a connection to the database """
		...

	@abstractmethod
	async def start_session(self):
		""" Starts a session in the database.

			Usually called once at the start of the service.
			Stays open as long as the service is running.

			Raises:
				producer.exception.DatabaseConnectionError
		"""
		...

	@abstractmethod
	async def end_session(self):
		""" Ends a session in the database. """
		...

	@abstractmethod
	async def find_by_title(self, title: str) -> List[Reference]:
		""" Searches for reference documents by title. """
		...

	@abstractmethod
	async def insert(self, document: Reference, metadata: ReferenceMetadata):
		""" Inserts a reference in the database. """
		...


class MongoDBClient(DatabaseClient):
	""" Wrapper around an AsyncIOMotorClient object. """
	def __init__(self):
		# Connection URI
		replicaset_uri = (
			f"mongodb://{config.MONGODB_USERNAME}:"
			f"{config.MONGODB_PASSWORD}@"
			f"{config.MONGODB_HOST}:"
			f"{config.MONGODB_PORT}/"
			f"{config.MONGODB_DATABASE}?"
			f"authSource={config.MONGODB_REFERENCE_MANAGER_COLLECTION}"
		)
		# Motor mongo client
		self._motor_client = AsyncIOMotorClient(replicaset_uri)
		# Mongo database
		self._db = self._motor_client[config.MONGODB_DATABASE]
		# Mongo collections
		self._reference_manager_coll = self._db[config.MONGODB_REFERENCE_MANAGER_COLLECTION]
		self._session = None

	@staticmethod
	async def meets_condition(db_type):
		return db_type == config.MONGO_DB

	async def close_connection(self):
		logger.info("Closing MongoDB connection")
		await self._motor_client.close()

	async def start_session(self):
		logger.info("Starting MongoDB session")
		try:
			self._session = await self._motor_client.start_session()
		except ServerSelectionTimeoutError as exc:
			raise DatabaseConnectionError(exc)

	async def end_session(self):
		logger.info("Ending MongoDB session")
		await self._session.end_session()

	async def find_by_title(self, title: str) -> List[Reference]:
		references = []

		async for document in self._reference_manager_coll.find({"title": title}):
			# Clear DB specific data
			del document["metadata"]
			del document["_id"]
			references.append(Reference(**document))

		return references

	async def insert(self, document: Reference, metadata: ReferenceMetadata):
		document = document.dict()

		document["metadata"] = metadata.dict()

		logger.info(f"Inserting {document}")
		await self._reference_manager_coll.insert_one(document)
