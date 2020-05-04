import datetime
import json
import requests
import time
from uuid import uuid4

from fastapi import (
	FastAPI,
	HTTPException,
	Query,
	Request,
)
from jwt import encode as jwt_encode, PyJWTError
from starlette.responses import RedirectResponse

from contextlog import contextlog
from producer.auth_providers import auth_providers
from producer import config
from producer.db_clients import get_db_client
from producer.exceptions import (
	exception_handling,
	DatabaseConnectionError,
	DocumentExists,
)
from producer.models.db_models import (
	InternalUser,
	Reference,
	ReferenceMetadata,
)
from producer.models.auth_models import (
	ExternalAuthToken,
	InternalAccessTokenData,
)


logger = contextlog.get_contextlog()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
	""" Startup functionality """
	logger.info("Starting up producer service")
	global db_client

	async with exception_handling():
		db_client = await get_db_client(config.DATABASE_TYPE)

		await db_client.start_session()


@app.on_event("shutdown")
async def shutdown_event():
	""" Shutdown functionality """
	async with exception_handling():
		await db_client.end_session()
		await db_client.close_connection()

	logger.info("Shutting down producer service")


@app.middleware("http")
async def setup_request(request: Request, call_next):
	""" A middleware for setting up a request. It creates a new request_id
		and adds some basic metrics.

		Args:
			request (fastapi.Request): The incoming request
			call_next (obj): The wrapper as per FastAPI docs

		Returns:
			response (fastapi.responses.JSONResponse): The json response
	"""
	contextlog.REQUEST_ID.set(str(uuid4()))

	start_time = time.time()

	response = await call_next(request)

	process_time = str(round(time.time() - start_time, 3))
	logger.info(f"Request took {process_time}s")

	return response


@app.put("/insert/")
async def insert(reference: Reference):
	""" API endpoint for inserting a new reference in the database """
	logger.info(f"Received - {reference.dict()}")

	async with exception_handling():
		title = reference.title
		existing_references = await db_client.find_by_title(title)

		if existing_references:
			for ref in existing_references:
				if reference.description == ref.description:
					raise DocumentExists(title)

		# Inject metadata related to the reference
		metadata = ReferenceMetadata(
			created_at=datetime.datetime.now()
		)

		await db_client.insert(reference, metadata)


@app.get("/login-redirect")
async def login_redirect(auth_provider: str):
	""" Redirects the user to the external authentication pop-up """
	provider = await auth_providers.get_auth_provider(auth_provider)

	request_uri = await provider.get_request_uri()

	return RedirectResponse(url=request_uri)


@app.get("/google-login-callback/")
async def google_login_callback(request: Request):
	""" Callback triggered when the user logs in to Google's pop-up.

		Receives an authentication_token from Google which then
		exchanges for an access_token. The latter is used to
		gain user information from Google's userinfo_endpoint.
	"""
	code = request.query_params.get("code")

	provider = await auth_providers.get_auth_provider(config.GOOGLE)

	# Authenticate token and get user's info from external provider
	external_user = await provider.get_user(
		auth_token=ExternalAuthToken(code=code)
	)

	# Get or create the internal user
	internal_user = await _get_internal_user(
		username=external_user.username,
		external_sub_id=external_user.sub_id
	)

	access_token = await _create_internal_access_token(
		InternalAccessTokenData(
			sub=internal_user.internal_sub_id,
			username=external_user.username,
		)
	)

	# Redirect the user to the home page
	return RedirectResponse(url=f"{config.FRONTEND_URL}?token={access_token}")


async def _get_internal_user(username: str, external_sub_id: str) -> InternalUser:
	""" Returns an internal user object as defined by this application.

		If the user cannot be found in the database, it gets created.

		Args:
			username: The username used in the external provider's system.
			external_sub_id: Unique identifier for a user in the external
							provider's system (i.e Google's, FaceBook's).

		Returns:
			internal_user: A user object that has meaning in this application
	"""
	internal_user = await _get_user_by_external_sub_id(
		username=username,
		external_sub_id=external_sub_id,
	)

	if internal_user is None:
		internal_user = await _create_user_with_external_sub_id(
			username=username,
			external_sub_id=external_sub_id,
		)

	return internal_user


async def _get_user_by_external_sub_id(username: str, external_sub_id: str) -> InternalUser:
	""" Returns an internal user from the database based on the subject
		id that is used by the external authentication provider.

		Args:
			username: The username used in the external provider's system.
			external_sub_id: Unique identifier for a user in the external
							provider's system (i.e Google's, FaceBook's).

		Returns:
			internal_user: A user object that has meaning in this application
	"""
	internal_user = await db_client.get_user_by_external_sub_id(
		username=username,
		external_sub_id=external_sub_id
	)
	return internal_user


async def _get_user_by_internal_sub_id(internal_sub_id) -> InternalUser:
	""" Returns an internal user from the database based on the subject
		id that is used by the internal system (this application)

		Args:
			internal_sub_id: Unique identifier for a user in this application

		Returns:
			internal_user: A user object that has meaning in this application
	"""
	internal_user = await db_client.get_user_by_internal_sub_id(
		internal_sub_id=internal_sub_id
	)
	return internal_user


async def _create_user_with_external_sub_id(username: str, external_sub_id: str) -> InternalUser:
	""" Creates an internal user to store in the database, using the
		subject id of the external authentication provider as a
		reference for future identification.

		Args:
			username: The username used in the external provider's system.
			external_sub_id: The subject id of the external provider

		Returns:
			internal_user: A user object that has meaning in this application
	"""
	internal_user = await db_client.create_user_with_external_sub_id(
		username=username,
		external_sub_id=external_sub_id
	)
	return internal_user


async def _create_internal_access_token(access_token_data: InternalAccessTokenData) -> str:
	""" Creates a JWT access token to return to the user.

		Args:
			access_token_data: The data to be included in the JWT access token

		Returns:
			encoded_jwt: The encoded JWT token

	"""
	expires_delta = datetime.timedelta(minutes=int(config.ACCESS_TOKEN_EXPIRE_MINUTES))

	to_encode = access_token_data.dict()

	expire = datetime.datetime.utcnow() + expires_delta

	to_encode.update(dict(exp=expire))

	encoded_jwt = jwt_encode(to_encode, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)

	return encoded_jwt
