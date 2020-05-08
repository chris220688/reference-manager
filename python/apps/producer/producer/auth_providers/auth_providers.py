import json
import requests

from abc import ABC, abstractmethod

from fastapi import HTTPException
from oauthlib.oauth2 import WebApplicationClient
from starlette.responses import RedirectResponse

from contextlog import contextlog
from producer import config
from producer.exceptions import (
	UnknownAuthenticationProvider,
)
from producer.models.auth_models import (
	ExternalAuthToken,
	ExternalUser,
)


logger = contextlog.get_contextlog()


async def get_auth_provider(auth_provider: str):
	""" Works out the correct authentication provider that needs
		to be contacted, based on the provider name that was
		passed as an argument.

		Raises:
			producer.exceptions.UnknownAuthenticationProvider
	"""
	for provider_cls in AuthProvider.__subclasses__():
		try:
			if await provider_cls.meets_condition(auth_provider):
				return provider_cls(client_id=provider_cls.client_id)
		except KeyError:
			continue

	raise UnknownAuthenticationProvider(auth_provider)


class AuthProvider(ABC):

	""" Authentication providers interface """
	def __init__(self, client_id: str):
		# OAuth 2 client setup
		self.auth_client = WebApplicationClient(client_id)

	@abstractmethod
	async def meets_condition(self):
		""" Checks whether this type of authentication provider
			matchers any of the ones defined in the configuration.

			Makes sure the correct provider will be instantiated.
		"""
		...

	@abstractmethod
	async def get_user(self, auth_token: ExternalAuthToken) -> ExternalUser:
		""" Receives an authentication token from an external provider (i.e Google, FaceBook)
			and exchanges it for an access token. Then, it retrieves the user's details from
			the external providers user-info endpoint.

			Args:
				auth_token: The authentication token received from the external provider

			Returns:
				external_user: A user object with the details of the user's account as
								it is stored in the external provider's system.
		"""
		...

	@abstractmethod
	async def get_request_uri(self) -> str:
		""" Returns the external provider's URL for sign in.

			For example, for Google this will be a URL that will
			bring up the Google sign in pop-up window and prompt
			the user to log-in.

			Returns:
				request_uri: Sign in pop-up URL
		"""
		...


class GoogleAuthProvider(AuthProvider):
	""" Google authentication class for authenticating users and
		requesting user's information via and OpenIdConnect flow.
	"""
	client_id = config.GOOGLE_CLIENT_ID

	@staticmethod
	async def meets_condition(auth_provider):
		return auth_provider == config.GOOGLE

	async def get_user(self, auth_token: ExternalAuthToken) -> ExternalUser:
		discovery_document = await self._get_discovery_document()
		token_endpoint = discovery_document["token_endpoint"]
		userinfo_endpoint = discovery_document["userinfo_endpoint"]

		# Request access_token from Google
		token_url, headers, body = self.auth_client.prepare_token_request(
			token_endpoint,
			redirect_url=config.GOOGLE_REDIRECT_URL,
			code=auth_token.code
		)
		token_response = requests.post(
			token_url,
			headers=headers,
			data=body,
			auth=(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET),
		)

		self.auth_client.parse_request_body_response(json.dumps(token_response.json()))

		# Request user's information from Google
		uri, headers, body = self.auth_client.add_token(userinfo_endpoint)
		userinfo_response = requests.get(uri, headers=headers, data=body)

		if userinfo_response.json().get("email_verified"):
			sub_id = userinfo_response.json()["sub"]
			username = userinfo_response.json()["given_name"]
		else:
			raise HTTPException(
				status_code=400,
				detail="User email not verified by Google."
			)

		external_user = ExternalUser(
			username=username,
			external_sub_id=sub_id
		)

		return external_user

	async def get_request_uri(self) -> str:
		discovery_document = await self._get_discovery_document()
		authorization_endpoint = discovery_document["authorization_endpoint"]

		request_uri = self.auth_client.prepare_request_uri(
			authorization_endpoint,
			redirect_uri=config.GOOGLE_REDIRECT_URL,
			scope=["openid", "email", "profile"],
		)

		return request_uri

	async def _get_discovery_document(self) -> dict:
		""" Returns the OpenId configuration information from Google.

			This is handy in order to get the:
				1. token endpoint
				2. authorization endpoint
				3. user info endpoint

			Returns:
				discovery_document: The configuration dictionary
		"""
		discovery_document = requests.get(config.GOOGLE_DISCOVERY_URL).json()
		return discovery_document
