from abc import ABC, abstractmethod
from contextlib import asynccontextmanager, closing

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorClientSession

from producer import config
from producer.exceptions import UnknownDatabaseType


async def get_db_client(db_type):
	for client_cls in DBClient.__subclasses__():
		try:
			if await client_cls.meets_condition(db_type):
				return client_cls()
		except KeyError:
			continue

		raise UnknownDatabaseType()


class DBClient(ABC):

	@abstractmethod
	async def meets_condition(self):
		...

	@abstractmethod
	async def close_connection(self):
		...

	@abstractmethod
	async def start_session(self):
		...

	@abstractmethod
	async def end_session(self):
		...

	@abstractmethod
	async def find(self, query):
		...

	@abstractmethod
	async def insert(self, document):
		...


class MongoDBClient(DBClient):
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
		print("Closing MongoDB connection")
		await self._motor_client.close()

	async def start_session(self):
		""" Starts a client session """
		print("Starting MongoDB session")
		self._session = await self._motor_client.start_session()

	async def end_session(self):
		print("Ending MongoDB session")
		await self._session.end_session()

	async def find(self, query):
		res = await self._reference_manager_coll.find_one(query)
		return res

	async def insert(self, document):
		await self._reference_manager_coll.insert_one(document)

