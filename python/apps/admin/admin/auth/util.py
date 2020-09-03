import datetime
import hashlib
import os

from jwt import encode as jwt_encode, decode as jwt_decode, PyJWTError

from contextlog import contextlog

from admin import config
from admin import db_client
from admin.exceptions import UnauthorizedUser
from admin.models.auth_models import AccessTokenData, AdminUser


logger = contextlog.get_contextlog()

async def validate_user_credentials(username: str, password: str):
	admin_user = await db_client.get_operator(username, password)

	if admin_user is None:
		raise UnauthorizedUser(f"Failed to login user {username}")


async def create_access_token(access_token_data: AccessTokenData) -> str:
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


async def validate_access_token(access_token: str) -> AdminUser:
	""" Checks the validity of an access token. If the token
		is valid it also checks whether there is an associated user
		in the database, and returns it.

		Args:
			access_token: Access token

		Returns:
			admin_user: A user object as defined in this application
	"""
	try:
		payload = jwt_decode(access_token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])

		username: str = payload.get("sub")
		if username is None:
			raise UnauthorizedUser("Missing 'sub' id from access token")

	except PyJWTError as exc:
		raise UnauthorizedUser(f"Failed to validate access token: {exc}")

	admin_user = await db_client.get_operator_by_username(username)

	if admin_user is None:
		raise UnauthorizedUser(f"User {admin_user.username} does not exist")

	return admin_user
