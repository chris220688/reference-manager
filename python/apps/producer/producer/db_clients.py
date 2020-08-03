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
from producer import config
from producer.exceptions import (
	DatabaseConnectionError,
	UnknownDatabaseType,
)
from producer.models.db_models import (
	InternalUser,
	RatingOptions,
	Reference,
	ReferenceMetadata,
	UserRating,
)
from producer.models.auth_models import (
	ExternalUser,
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
	async def find_by_id(self, reference_id: str) -> Reference:
		""" Searches for reference documents by id.

			Args:
				reference_id: The unique id of the reference

			Returns:
				reference: The reference item, if found
		"""
		...

	@abstractmethod
	async def delete_by_id(self, reference_id: str) -> int:
		""" Deletes reference documents by id.

			Args:
				reference_id: The unique id of the reference

			Returns:
				deleted_count: Number of deleted items
		"""
		...

	@abstractmethod
	async def find_by_title(self, title: str) -> List[Reference]:
		""" Searches for reference documents by title.

			Args:
				title: The title of the reference

			Returns:
				references: A list of references that match the title
		"""
		...

	@abstractmethod
	async def find_by_author(self, internal_sub_id: str) -> List[Reference]:
		""" Searches for reference documents by author.

			Args:
				internal_sub_id: The unique id of the user as defined in this application

			Returns:
				references: A list of references that match the author
		"""
		...

	@abstractmethod
	async def find_bookmarked_by_author(self, internal_sub_id: str) -> List[Reference]:
		""" Searches for reference documents by bookmarked ids of the author.

			Args:
				internal_sub_id: The unique id of the user as defined in this application

			Returns:
				references: A list of references that match the author
		"""
		...

	@abstractmethod
	async def insert_reference(self, document: Reference, metadata: ReferenceMetadata) -> Reference:
		""" Inserts a reference in the database.

			Args:
				document: A reference to insert in the database

			Returns:
				reference_id: The id of the inserted item
		"""
		...

	@abstractmethod
	async def rate_reference(self, reference_id: int, rate_option: str, internal_user: InternalUser) -> bool:
		""" Updates the reference status of a user's rated references.

			Also updates the count of thumbs_up/thumbs_down of a reference

			Args:
				reference_id: The reference_id to add to the bookmarks
				rate_option: One of thumbs_up/thumbs_down/not_rated
				internal_user: A user objects as defined in this application

			Returns:
				success: True if the updates were successful
		"""
		...

	@abstractmethod
	async def add_bookmark(self, reference_id: int, internal_user: InternalUser):
		""" Creates a new bookmark in the user's account, for a given reference

			Args:
				reference_id: The reference_id to add to the bookmarks
				internal_user: A user objects as defined in this application
		"""
		...

	@abstractmethod
	async def remove_bookmark(self, reference_id: int, internal_user: InternalUser):
		""" Given a reference_id, it deletes the bookmark from the user's account

			Args:
				reference_id: The reference_id to remove from the bookmarks
				internal_user: A user objects as defined in this application

			Returns:
				deleted_count: Number of deleted items
		"""
		...

	@abstractmethod
	async def get_user_by_external_sub_id(self, external_user: ExternalUser) -> InternalUser:
		""" Returns a user from the database, based on the external sub_id of
			the current authentication provider (i.e Google, FaceBook etc)

			Args:
				external_user: An object representing a user with information
								based on the external provider's service.

			Returns:
				internal_user: A user objects as defined in this application
		"""
		...

	@abstractmethod
	async def get_user_by_internal_sub_id(self, internal_sub_id: str) -> InternalUser:
		""" Returns a user from the database, based on the internal sub_id

			Args:
				internal_sub_id: The unique id of the user as defined in this application

			Returns:
				internal_user: A user objects as defined in this application
		"""
		...

	@abstractmethod
	async def create_internal_user(self, external_user: ExternalUser) -> InternalUser:
		""" Creates a user in the database based on the external sub_id of
			the current authentication provider (i.e Google, FaceBook etc)

			The user will also be assigned an internal sub_id for authentication
			within the internal system (reference manager application)

			Args:
				external_user: An object representing a user with information
								based on the external provider's service.

			Returns:
				internal_user: A user objects as defined in this application
		"""
		...

	@abstractmethod
	async def delete_internal_user(self, internal_user: InternalUser) -> int:
		""" Deletes a user account from the database. If the user is an author
			and has already created reference, updates the 'author' of these
			references and sets it to 'orphan'.

			Args:
				internal_user: A user objects as defined in this application

			Returns:
				deleted_count: Number of deleted items
		"""
		...

	@abstractmethod
	async def update_internal_user(self, internal_user: InternalUser) -> InternalUser:
		""" Updates a user in the database

			Args:
				internal_user: A user objects as defined in this application

			Returns:
				internal_user: A user objects as defined in this application
		"""
		...

	async def _encrypt_external_sub_id(sefl, external_user: ExternalUser) -> str:
		""" It encrypts the subject id received from the external provider. These ids are
			used to uniquely identify a user in the system of the external provider and
			are usually public. However, it is better to be stored encrypted just in case.

			Args:
				external_user: An object representing a user with information
								based on the external provider's service.

			Returns:
				encrypted_external_sub_id: The encrypted external subject id
		"""
		salt = external_user.email.lower()
		salt = salt.replace(" ", "")
		# Hash the salt so that the email is not plain text visible in the database
		salt = hashlib.sha256(salt.encode()).hexdigest()
		# bcrypt requires a 22 char salt
		if len(salt) > 21:
			salt = salt[:21]

		# As per passlib the last character of the salt should always be one of [.Oeu]
		salt = salt + "O"

		encrypted_external_sub_id = bcrypt.using(salt=salt).hash(external_user.external_sub_id)
		return encrypted_external_sub_id


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

	async def find_by_id(self, reference_id: str) -> Reference:
		reference = None
		reference_doc = await self._reference_manager_coll.find_one({'_id': reference_id})

		if reference_doc:
			del reference_doc["metadata"]
			del reference_doc["_id"]
			reference = Reference(**reference_doc)

		return reference

	async def delete_by_id(self, reference_id: str) -> int:
		result = await self._reference_manager_coll.delete_one({'_id': reference_id})
		return result.deleted_count

	async def find_by_title(self, title: str) -> List[Reference]:
		references = []

		async for document in self._reference_manager_coll.find({"title": title}):
			# Clear DB specific data
			del document["metadata"]
			del document["_id"]
			references.append(Reference(**document))

		return references

	async def find_by_author(self, internal_sub_id: str) -> List[Reference]:
		references = []

		async for document in self._reference_manager_coll.find({"metadata.author_id": internal_sub_id}):
			# Clear DB specific data
			del document["metadata"]
			del document["_id"]
			references.append(Reference(**document))

		return references

	async def find_bookmarked_by_author(self, internal_user: InternalUser) -> List[Reference]:
		references = []

		async for document in self._reference_manager_coll.find({
			"reference_id": {"$in": internal_user.bookmarked_references}
		}):
			# Clear DB specific data
			del document["metadata"]
			del document["_id"]
			references.append(Reference(**document))

		return references

	async def insert_reference(self, document: Reference, metadata: ReferenceMetadata) -> Reference:
		inserted_reference = None

		document = document.dict()
		document["_id"] = str(uuid4())
		document["reference_id"] = document["_id"]
		document["metadata"] = metadata.dict()

		logger.info(f"Inserting {document}")
		result = await self._reference_manager_coll.insert_one(document)

		if result:
			inserted_reference = await self.find_by_id(result.inserted_id)

		return inserted_reference

	async def rate_reference(self, reference_id: int, rate_option: str, internal_user: InternalUser) -> bool:
		reference_doc = await self._reference_manager_coll.find_one({'_id': reference_id})

		if not reference_doc:
			return

		if reference_id in internal_user.rated_references:
			existing_rating_option = internal_user.rated_references[reference_id]
			if rate_option == existing_rating_option:
				del internal_user.rated_references[reference_id]

				if rate_option == RatingOptions.thumbs_up:
					reference_doc["rating"]["positive"] = reference_doc["rating"]["positive"] - 1
				elif rate_option == RatingOptions.thumbs_down:
					reference_doc["rating"]["negative"] = reference_doc["rating"]["negative"] - 1

			else:
				if rate_option == RatingOptions.thumbs_up and existing_rating_option == RatingOptions.thumbs_down:
					reference_doc["rating"]["positive"] = reference_doc["rating"]["positive"] + 1
					reference_doc["rating"]["negative"] = reference_doc["rating"]["negative"] - 1

				elif rate_option == RatingOptions.thumbs_down and existing_rating_option == RatingOptions.thumbs_up:
					reference_doc["rating"]["positive"] = reference_doc["rating"]["positive"] - 1
					reference_doc["rating"]["negative"] = reference_doc["rating"]["negative"] + 1

				internal_user.rated_references[reference_id] = rate_option
		else:
			internal_user.rated_references[reference_id] = rate_option

			if rate_option == RatingOptions.thumbs_up:
				reference_doc["rating"]["positive"] = reference_doc["rating"]["positive"] + 1
			elif rate_option == RatingOptions.thumbs_down:
				reference_doc["rating"]["negative"] = reference_doc["rating"]["negative"] + 1

		reference_update_result = await self._reference_manager_coll.update_one(
			{"reference_id": reference_id},
			{"$set": {"rating": reference_doc["rating"]}}
		)

		user_update_result = await self._users_coll.update_one(
			{"internal_sub_id": internal_user.internal_sub_id},
			{"$set": {"rated_references": internal_user.rated_references}}
		)

		if reference_update_result.modified_count and user_update_result.modified_count:
			return True

		return False



	async def add_bookmark(self, reference_id: int, internal_user: InternalUser):
		if reference_id not in internal_user.bookmarked_references:

			internal_user.bookmarked_references.append(reference_id)

			result = await self._users_coll.update_one(
				{"internal_sub_id": internal_user.internal_sub_id},
				{"$set": {"bookmarked_references": internal_user.bookmarked_references}}
			)

			return result.modified_count

	async def remove_bookmark(self, reference_id: int, internal_user: InternalUser):
		if reference_id in internal_user.bookmarked_references:

			internal_user.bookmarked_references.remove(reference_id)

			result = await self._users_coll.update_one(
				{"internal_sub_id": internal_user.internal_sub_id},
				{"$set": {"bookmarked_references": internal_user.bookmarked_references}}
			)

			return result.modified_count


	async def get_user_by_external_sub_id(self, external_user: ExternalUser) -> InternalUser:
		internal_user = None

		encrypted_external_sub_id = await self._encrypt_external_sub_id(external_user)

		mongo_user = await self._users_coll.find_one({'external_sub_id': encrypted_external_sub_id})

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

		return internal_user

	async def get_user_by_internal_sub_id(self, internal_sub_id: str) -> InternalUser:
		internal_user = None

		mongo_user = await self._users_coll.find_one({'_id': internal_sub_id})

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

		return internal_user

	async def create_internal_user(self, external_user: ExternalUser) -> InternalUser:
		encrypted_external_sub_id = await self._encrypt_external_sub_id(external_user)
		unique_identifier = str(uuid4())

		result = await self._users_coll.insert_one(
			dict(
				_id=unique_identifier,
				internal_sub_id=unique_identifier,
				external_sub_id=encrypted_external_sub_id,
				username=external_user.username,
				is_author=False,
				requested_join=False,
				bookmarked_references=[],
				rated_references=[],
				created_at=datetime.datetime.utcnow(),
			)
		)

		mongo_user_id = result.inserted_id

		mongo_user = await self._users_coll.find_one({'_id': mongo_user_id})

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

		return internal_user

	async def delete_internal_user(self, internal_user: InternalUser) -> int:
		result = await self._users_coll.delete_one({'_id': internal_user.internal_sub_id})

		if result.deleted_count:
			await self._reference_manager_coll.update_many(
				{"metadata.author_id": internal_user.internal_sub_id},
				{"$set": {"metadata.author_id": "orphan"}}
			)

		return result.deleted_count

	async def update_internal_user(self, internal_user: InternalUser) -> InternalUser:
		updated_user = None

		result = await self._users_coll.update_one(
			{"internal_sub_id": internal_user.internal_sub_id},
			{"$set": internal_user.dict()}
		)

		if result.modified_count:
			updated_user = internal_user

		return updated_user
