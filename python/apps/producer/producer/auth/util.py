import datetime

from jwt import encode as jwt_encode, decode as jwt_decode, PyJWTError

from contextlog import contextlog

from producer import cache
from producer import config
from producer import db_client
from producer.exceptions import UnauthorizedUser
from producer.models.db_models import InternalUser
from producer.models.auth_models import (
	InternalAccessTokenData,
	InternalAuthToken,
)


logger = contextlog.get_contextlog()

async def create_internal_auth_token(internal_user: InternalUser) -> InternalAuthToken:
	""" Creates a one time JWT authentication token to return to the user.
		The token is used as a key to cache the user's internal id until
		he requests for an access token when it is removed from the cache.

		Args:
			internal_user: A user object that has meaning in this application

		Returns:
			encoded_jwt: The encoded JWT authentication token

	"""
	expires_delta = datetime.timedelta(
		minutes=int(config.AUTH_TOKEN_EXPIRE_MINUTES)
	)

	expire = datetime.datetime.utcnow() + expires_delta

	to_encode = dict(exp=expire)

	encoded_jwt = jwt_encode(
		to_encode, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM
	).decode('utf-8')

	# Add token/user pair in the cache
	await cache.set(encoded_jwt, internal_user.internal_sub_id)

	return encoded_jwt


async def validate_internal_auth_token(internal_auth_token: str) -> InternalUser:
	""" Checks the validity of an internal authentication token.
		If the token is valid it also checks whether there is an
		associated user in the cache, and returns it.

		Args:
			internal_auth_token: Internal authentication token

		Returns:
			internal_user: A user objects as defined in this application
	"""
	try:
		jwt_decode(internal_auth_token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])
	except PyJWTError as exc:
		raise UnauthorizedUser(f"Failed to validate auth token: {exc}")

	internal_sub_id = await cache.get(internal_auth_token)

	if not internal_sub_id:
		raise UnauthorizedUser(f"User {internal_sub_id} not cached")

	# Invalidate cache. Authentication token can only be used once
	await cache.delete(internal_auth_token)

	internal_user = await db_client.get_user_by_internal_sub_id(internal_sub_id)

	return internal_user


async def create_internal_access_token(access_token_data: InternalAccessTokenData) -> str:
	""" Creates a JWT access token to return to the user.

		Args:
			access_token_data: The data to be included in the JWT access token

		Returns:
			encoded_jwt: The encoded JWT access token
	"""
	expires_delta = datetime.timedelta(minutes=int(config.ACCESS_TOKEN_EXPIRE_MINUTES))
	to_encode = access_token_data.dict()
	expire = datetime.datetime.utcnow() + expires_delta
	to_encode.update(dict(exp=expire))
	encoded_jwt = jwt_encode(to_encode, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)

	return encoded_jwt.decode('utf-8')


async def validate_internal_access_token(internal_access_token: str) -> InternalUser:
	""" Checks the validity of an internal access token. If the token
		is valid it also checks whether there is an associated user
		in the database, and returns it.

		Args:
			internal_access_token: Internal access token

		Returns:
			internal_user: A user objects as defined in this application
	"""
	try:
		payload = jwt_decode(internal_access_token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])

		internal_sub_id: str = payload.get("sub")
		if internal_sub_id is None:
			raise UnauthorizedUser("Missing 'sub' id from access token")

	except PyJWTError as exc:
		raise UnauthorizedUser(f"Failed to validate access token: {exc}")

	internal_user = await db_client.get_user_by_internal_sub_id(internal_sub_id)

	if internal_user is None:
		raise UnauthorizedUser(f"User {internal_sub_id} does not exist")

	return internal_user
