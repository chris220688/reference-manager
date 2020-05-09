from typing import Optional

from fastapi.security.utils import get_authorization_scheme_param
from fastapi import Request

from producer.exceptions import (
	UnauthorizedUser,
	exception_handling,
)
from producer.models.db_models import InternalUser
from producer.auth import util as auth_util


class AccessTokenCookieBearer():

	async def __call__(self, request: Request) -> InternalUser:
		async with exception_handling():
			internal_access_token: str = request.cookies.get('access_token')
			if not internal_access_token:
				raise UnauthorizedUser("Invalid access token cookie")

			# Remove Bearer
			internal_access_token = internal_access_token.split()[1]

			internal_user = await auth_util.validate_internal_access_token(internal_access_token)

			return internal_user


class AuthTokenBearer():

	async def __call__(self, request: Request) -> Optional[str]:
		async with exception_handling():
			authorization: str = request.headers.get("Authorization")
			scheme, internal_auth_token = get_authorization_scheme_param(authorization)

			if not authorization or scheme.lower() != "bearer":
				raise UnauthorizedUser("Invalid authentication token")

			internal_user = await auth_util.validate_internal_auth_token(internal_auth_token)

			return internal_user
