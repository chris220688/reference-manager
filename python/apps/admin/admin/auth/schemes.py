from typing import Optional

from fastapi import Request

from admin.exceptions import (
	UnauthorizedUser,
	exception_handling,
)
from admin.models.auth_models import AdminUser
from admin.auth import util as auth_util


class AccessTokenCookieBearer():
	""" Scheme that checks the validity of the access token
		that is stored to an HTTPOnly secure cookie in order
		to authorize the user.
	"""
	async def __call__(self, request: Request) -> AdminUser:
		async with exception_handling():
			access_token: str = request.cookies.get('access_token')
			if not access_token:
				return None

			# Remove Bearer
			access_token = access_token.split()[1]

			admin_user = await auth_util.validate_access_token(access_token)

			return admin_user
