from abc import ABC, abstractmethod
import datetime
from typing import List
from uuid import uuid4

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
from producer.models.db_models import (
	InternalUser,
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

	@abstractmethod
	async def get_user_by_external_sub_id(self, external_sub_id: str) -> InternalUser:
		""" Returns a user from the database, based on the external sub_id of
			the current authentication provider (i.e Google, FaceBook etc)
		"""
		...

	@abstractmethod
	async def get_user_by_internal_sub_id(self, internal_sub_id: str) -> InternalUser:
		""" Returns a user from the database, based on the internal sub_id """
		...

	@abstractmethod
	async def create_user_with_external_sub_id(self, external_sub_id: str) -> InternalUser:
		""" Creates a user in the database based on the external sub_id of
			the current authentication provider (i.e Google, FaceBook etc)

			The user will also be assigned an internal sub_id for authentication
			within the internal system (reference manager application)
		"""
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
		self._users_coll = self._db["users"]
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

	async def get_user_by_external_sub_id(self, external_sub_id: str) -> InternalUser:
		internal_user = None

		mongo_user = await self._users_coll.find_one({'external_sub_id': external_sub_id})

		if mongo_user:
			internal_user = InternalUser(
				internal_sub_id=mongo_user.get("internal_sub_id"),
				external_sub_id=mongo_user.get("external_sub_id"),
				created_at=mongo_user.get("created_at"),
			)

		return internal_user

	async def get_user_by_internal_sub_id(self, internal_sub_id: str) -> InternalUser:
		internal_user = None

		mongo_user = await self._users_coll.find_one({'_id': internal_sub_id})

		if mongo_user:
			internal_user = InternalUser(
				internal_sub_id=mongo_user.get("internal_sub_id"),
				external_sub_id=mongo_user.get("external_sub_id"),
				created_at=mongo_user.get("created_at"),
			)

		return internal_user

	async def create_user_with_external_sub_id(self, external_sub_id: str) -> InternalUser:
		unique_identifier = str(uuid4())
		result = await self._users_coll.insert_one(
			dict(
				_id=unique_identifier,
				internal_sub_id=unique_identifier,
				external_sub_id=external_sub_id,
				created_at=datetime.datetime.utcnow(),
			)
		)

		mongo_user_id = result.inserted_id

		mongo_user = await self._users_coll.find_one({'_id': mongo_user_id})

		internal_user = InternalUser(
			internal_sub_id=mongo_user.get("internal_sub_id"),
			external_sub_id=mongo_user.get("external_sub_id"),
			created_at=mongo_user.get("created_at"),
		)

		return internal_user
