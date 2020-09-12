from abc import ABC, abstractmethod
import datetime
import hashlib
from typing import List
from uuid import uuid4

from motor.motor_asyncio import (
	AsyncIOMotorClient,
	AsyncIOMotorClientSession,
)
from passlib.hash import bcrypt
from pymongo.errors import ServerSelectionTimeoutError

from contextlog import contextlog
from admin import config
from admin.exceptions import (
	DatabaseConnectionError,
	DocumentDoesNotExist,
	UnknownDatabaseType,
	UserDoesNotExist,
)
from admin.models.auth_models import AdminUser
from admin.models.db_models import (
	InternalUser,
	Rating,
	RatingOptions,
	Reference,
	ReferenceMetadata,
	UserRating,
)


logger = contextlog.get_contextlog()

def get_db_client(db_type):
	""" Works out the correct database client based on
		the database type provided in the configuration

		Raises:
			producer.exceptions.UnknownDatabaseType
	"""
	for client_cls in DatabaseClient.__subclasses__():
		try:
			if client_cls.meets_condition(db_type):
				return client_cls()
		except KeyError:
			continue

	raise UnknownDatabaseType(db_type)


class DatabaseClient(ABC):
	""" Database client interface """

	@abstractmethod
	def meets_condition(db_type: str):
		""" Checks whether this type of database client matches
			the one defined in the configuration.

			Makes sure the correct client will be instantiated.

			Args:
				db_type: One of database types as defined in config
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
	async def get_operator(self, username: str, password: str) -> AdminUser:
		""" Searches for an admin user in the database """
		...

	@abstractmethod
	async def get_operator_by_username(self, username: str) -> AdminUser:
		""" Searches for a user in the database by username """
		...

	@abstractmethod
	async def get_users(self, requested_join: int, is_author: int) -> List[InternalUser]:
		""" Searches for regular users in the database """
		...

	@abstractmethod
	async def get_user_by_id(self, internal_sub_id: str) -> InternalUser:
		""" Returns a user from the database, based on the user id

			Args:
				internal_sub_id: The unique id of the user as defined in this application

			Returns:
				internal_user: A user object as defined in this application
		"""
		...

	@abstractmethod
	async def update_user(self, internal_sub_id: str, requested_join: bool, is_author: bool) -> bool:
		""" Updates a user in the database """
		...

	@abstractmethod
	async def get_references(
		self,
		has_amazon_links: bool,
		has_waterstones_links: bool,
		has_bookdepository_links: bool,
	) -> List[Reference]:
		""" Searches for references in the database """
		...

	async def update_reference_link(self, reference_id: str, book_name: str, link_type: str, link_url: str) -> int:
		""" Updates the link of a specific book for a given reference """
		...

	@abstractmethod
	async def get_reference_by_id(self, reference_id: str) -> Reference:
		""" Returns a reference from the database, based on the reference id

			Args:
				reference_id: The unique id of the reference as defined in this application

			Returns:
				reference: A reference object as defined in this application
		"""
		...

	async def _encrypt_password(self, username: str, password: str) -> str:
		""" It encrypts the password of the admin user.

			Args:
				username: Username
				password: Password

			Returns:
				encrypted_password: The encrypted password
		"""
		salt = username.lower()
		salt = salt.replace(" ", "")
		# Hash the salt so that the password is not plain text visible in the database
		salt = hashlib.sha256(salt.encode()).hexdigest()
		# bcrypt requires a 22 char salt
		if len(salt) > 21:
			salt = salt[:21]

		# As per passlib the last character of the salt should always be one of [.Oeu]
		salt = salt + "O"

		encrypted_password = bcrypt.using(salt=salt).hash(password)
		return encrypted_password


class MongoDBClient(DatabaseClient):
	""" Wrapper around an AsyncIOMotorClient object. """
	def __init__(self):
		# Connection arguments
		mongo_args = dict(
			host=config.MONGODB_HOST,
			port=config.MONGODB_PORT,
			username=config.MONGODB_USERNAME,
			password=config.MONGODB_PASSWORD,
			replicaset=config.MONGODB_REPLICASET,
			authSource=config.MONGODB_DATABASE,
			retryWrites=True,
			serverSelectionTimeoutMS=30000
		)
		replicaset_uri = (
			f"mongodb://{config.MONGODB_USERNAME}:"
			f"{config.MONGODB_PASSWORD}@"
			f"{config.MONGODB_HOST}:"
			f"{config.MONGODB_PORT}/"
			f"{config.MONGODB_DATABASE}?"
			f"authSource={config.MONGODB_REFERENCE_MANAGER_COLLECTION}"
		)

		# Motor mongo client
		if config.LOCAL_DEPLOYMENT:
			self._motor_client = AsyncIOMotorClient(replicaset_uri)
		else:
			self._motor_client = AsyncIOMotorClient(**mongo_args)

		# Mongo database
		self._db = self._motor_client[config.MONGODB_DATABASE]
		# Mongo collections
		self._reference_manager_coll = self._db[config.MONGODB_REFERENCE_MANAGER_COLLECTION]
		self._users_coll = self._db["users"]
		self._operators_coll = self._db["operators"]
		self._session = None

	@staticmethod
	def meets_condition(db_type):
		return db_type == config.MONGO_DB

	async def close_connection(self):
		logger.info("Closing MongoDB connection")
		self._motor_client.close()

	async def start_session(self):
		logger.info("Starting MongoDB session")
		try:
			self._session = await self._motor_client.start_session()
		except ServerSelectionTimeoutError as exc:
			raise DatabaseConnectionError(exc)

	async def end_session(self):
		logger.info("Ending MongoDB session")
		await self._session.end_session()

	async def get_operator(self, username: str, password: str) -> AdminUser:
		admin_user = None

		encrypted_password = await self._encrypt_password(username=username, password=password)
		mongo_user = await self._operators_coll.find_one({
			"username": username,
			"password": encrypted_password
		})

		if mongo_user:
			admin_user = AdminUser(
				username=mongo_user["username"],
				password=mongo_user["password"],
			)

		return admin_user

	async def get_operator_by_username(self, username: str) -> AdminUser:
		admin_user = None
		mongo_user = await self._operators_coll.find_one({"username": username})

		if mongo_user:
			admin_user = AdminUser(
				username=mongo_user["username"],
				password=mongo_user["password"],
			)

		return admin_user

	async def get_users(self, requested_join: int, is_author: int) -> List[dict]:
		requested_join_filter = {}
		if requested_join == 1:
			requested_join_filter["requested_join"] = True
		elif requested_join == 2:
			requested_join_filter["requested_join"] = False

		is_author_filter = {}
		if is_author == 1:
			is_author_filter["is_author"] = True
		elif is_author == 2:
			is_author_filter["is_author"] = False

		aggregations = []
		if requested_join_filter:
			aggregations.append(requested_join_filter)
		if is_author_filter:
			aggregations.append(is_author_filter)

		if aggregations:
			filters = {
				"$and": aggregations
			}
		else:
			filters = {}

		users = []
		async for mongo_user in self._users_coll.find(filters):
			users.append(
				InternalUser(
					internal_sub_id=mongo_user["internal_sub_id"],
					external_sub_id=mongo_user["external_sub_id"],
					username=mongo_user["username"],
					is_author=mongo_user["is_author"],
					requested_join=mongo_user["requested_join"],
					bookmarked_references=mongo_user["bookmarked_references"],
					rated_references=mongo_user["rated_references"],
					created_at=mongo_user["created_at"],
				)
			)

		return users

	async def get_user_by_id(self, internal_sub_id: str) -> InternalUser:
		internal_user = None

		mongo_user = await self._users_coll.find_one({'internal_sub_id': internal_sub_id})

		if mongo_user:
			internal_user = InternalUser(
				internal_sub_id=mongo_user["internal_sub_id"],
				external_sub_id=mongo_user["external_sub_id"],
				username=mongo_user["username"],
				is_author=mongo_user["is_author"],
				requested_join=mongo_user["requested_join"],
				bookmarked_references=mongo_user["bookmarked_references"],
				rated_references=mongo_user["rated_references"],
				created_at=mongo_user["created_at"],
			)
		else:
			raise UserDoesNotExist(f"User {internal_sub_id} does not exist")

		return internal_user

	async def update_user(self, internal_sub_id: str, requested_join: bool, is_author: bool) -> bool:
		updated_user = None

		update_fields = {}
		if requested_join is not None:
			update_fields["requested_join"] = requested_join
		if is_author is not None:
			update_fields["is_author"] = is_author

		result = await self._users_coll.update_one(
			{'_id': internal_sub_id},
			{'$set': update_fields}
		)

		return result.modified_count

	async def get_reference_by_id(self, reference_id: str) -> Reference:
		reference = None
		reference_doc = await self._reference_manager_coll.find_one({"_id": reference_id})

		if reference_doc:
			del reference_doc["metadata"]
			del reference_doc["_id"]
			reference = Reference(**reference_doc)

		return reference

	async def get_references(
		self,
		has_amazon_links: int,
		has_waterstones_links: int,
		has_bookdepository_links: int,
	) -> List[Reference]:

		amazon_filter = {}
		if has_amazon_links == 1:
			amazon_filter["books.book_links.link_type"] = "amazon"
		elif has_amazon_links == 2:
			amazon_filter["books.book_links.link_type"] = {"$ne": "amazon"}

		waterstones_filter = {}
		if has_waterstones_links == 1:
			waterstones_filter["books.book_links.link_type"] = "waterstones"
		elif has_waterstones_links == 2:
			waterstones_filter["books.book_links.link_type"] = {"$ne": "waterstones"}

		bookdepository_filter = {}
		if has_bookdepository_links == 1:
			bookdepository_filter["books.book_links.link_type"] = "bookdepository"
		elif has_bookdepository_links == 2:
			bookdepository_filter["books.book_links.link_type"] = {"$ne": "bookdepository"}

		aggregations = []
		if amazon_filter:
			aggregations.append(amazon_filter)
		if waterstones_filter:
			aggregations.append(waterstones_filter)
		if bookdepository_filter:
			aggregations.append(bookdepository_filter)

		if aggregations:
			filters = {
				"$and": aggregations
			}
		else:
			filters = {}

		references = []
		async for document in self._reference_manager_coll.find(filters):
			# Clear DB specific data
			del document["metadata"]
			del document["_id"]
			references.append(Reference(**document))

		return references

	async def update_reference_link(self, reference_id: str, book_name: str, link_type: str, link_url: str) -> int:
		reference_doc = await self._reference_manager_coll.find_one({"_id": reference_id})

		for book in reference_doc.get("books"):
			if book.get("name") == book_name:
				has_links = False
				for link in book.get("book_links"):
					if link.get("link_type") == link_type:
						has_links = True
						break

				if has_links:
					for i, link in enumerate(book.get("book_links")):
						if link.get("link_type") == link_type:
							if link_url == "":
								del book["book_links"][i]
							else:
								link["link_url"] = link_url
							break
				else:
					book["book_links"].append(
						dict(
							link_type=link_type,
							link_url=link_url,
						)
					)

		result = await self._reference_manager_coll.update_one(
			{'_id': reference_id},
			{'$set': reference_doc}
		)

		return result.modified_count
