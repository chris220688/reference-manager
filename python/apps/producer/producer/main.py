import asyncio
import datetime
import json
import requests
import time
from uuid import uuid4

from aiocache import Cache
from fastapi import (
	Depends,
	FastAPI,
	HTTPException,
	Query,
	Request,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jwt import encode as jwt_encode, decode as jwt_decode, PyJWTError
from starlette.responses import RedirectResponse, Response, JSONResponse

from contextlog import contextlog
from producer.auth_providers import auth_providers
from producer import config
from producer.db_clients import get_db_client
from producer.exceptions import (
	DatabaseConnectionError,
	DocumentExists,
	UnauthorizedUser,
	exception_handling,
)
from producer.models.db_models import (
	InternalUser,
	Reference,
	ReferenceMetadata,
)
from producer.models.auth_models import (
	ExternalAuthToken,
	ExternalUser,
	InternalAccessTokenData,
	InternalAuthToken,
)


logger = contextlog.get_contextlog()

app = FastAPI()

# origins = [
# 	"http://localhost:3000",
# ]
# app.add_middleware(
# 	CORSMiddleware,
# 	allow_origins=origins,
# 	allow_credentials=True,
# 	allow_methods=["*"],
# 	allow_headers=["*"],
# )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login-redirect")
cache = Cache()


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
async def insert_reference(reference: Reference, internal_access_token: str = Depends(oauth2_scheme)):
	""" API endpoint for inserting a new reference in the database """
	internal_user = await _validate_internal_access_token(internal_access_token)

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
			created_at=datetime.datetime.now(),
			author_id=internal_user.internal_sub_id,
		)

		await db_client.insert_reference(reference, metadata)


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
	internal_user = await _get_internal_user(external_user=external_user)

	internal_auth_token = await _create_internal_auth_token(internal_user)

	# Redirect the user to the home page
	return RedirectResponse(url=f"{config.FRONTEND_URL}?authToken={internal_auth_token}")


@app.get("/login/")
async def login(response: JSONResponse, internal_auth_token: str = Depends(oauth2_scheme)):
	""" Login endpoint for authenticating a user after he has received
		and access token.
	"""
	internal_user = await _validate_internal_auth_token(internal_auth_token)

	access_token = await _create_internal_access_token(
		InternalAccessTokenData(
			sub=internal_user.internal_sub_id,
			username="TEST USER FOR NOW UNTIL I FIX THE USERNAMES WITH SOMETHING MORE CLEVER THAN PASSING IN THE CACHE. DON'T FORGET IT!",
		)
	)

	response = JSONResponse(
		content=jsonable_encoder({"userLoggedIn": True}),
	)

	response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)

	return response


@app.get("/user-logged/")
async def user_logged(request: Request):#internal_access_token: str = Depends(oauth2_scheme)):
	userLoggedIn = False

	internal_access_token = request.cookies.get('access_token')

	if not internal_access_token:
		userLoggedIn = False
	else:
		# Remove Bearer
		internal_access_token = internal_access_token.split()[1]

		await _validate_internal_access_token(internal_access_token)
		userLoggedIn = True

	response = JSONResponse(
		content=jsonable_encoder({"userLoggedIn": userLoggedIn}),
	)

	return response


async def _get_internal_user(external_user: ExternalUser) -> InternalUser:
	""" Returns an internal user object as defined by this application.

		If the user cannot be found in the database, it gets created.

		Args:
			external_user: An object representing a user with information
							based on the external provider's service.

		Returns:
			internal_user: A user object that has meaning in this application
	"""
	internal_user = await db_client.get_user_by_external_sub_id(external_user)

	if internal_user is None:
		internal_user = await db_client.create_internal_user(external_user)

	return internal_user


async def _create_internal_auth_token(internal_user: InternalUser) -> InternalAuthToken:
	""" Creates a JWT authentication token to return to the user.

		Args:
			internal_user: A user object that has meaning in this application

		Returns:
			encoded_jwt: The encoded JWT authentication token

	"""
	expires_delta = datetime.timedelta(minutes=int(config.AUTH_TOKEN_EXPIRE_MINUTES))
	expire = datetime.datetime.utcnow() + expires_delta
	to_encode = dict(exp=expire)
	encoded_jwt = jwt_encode(
		to_encode, config.JWT_SECRET_KEY, algorithm=config.ALGORITHM
	).decode('utf-8')

	# Add token/user pair in the cache
	await cache.set(encoded_jwt, internal_user.internal_sub_id)

	return encoded_jwt


async def _validate_internal_auth_token(internal_auth_token: str) -> InternalUser:
	try:
		jwt_decode(internal_auth_token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])
	except PyJWTError:
		raise UnauthorizedUser("Token expired")

	internal_sub_id = await cache.get(internal_auth_token)

	if not internal_sub_id:
		raise UnauthorizedUser("Invalid auth token")

	internal_user = await db_client.get_user_by_internal_sub_id(internal_sub_id)

	return internal_user


async def _create_internal_access_token(access_token_data: InternalAccessTokenData) -> str:
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


async def _validate_internal_access_token(internal_access_token: str) -> InternalUser:
	try:
		payload = jwt_decode(internal_access_token, config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])

		internal_sub_id: str = payload.get("sub")
		if internal_sub_id is None:
			raise UnauthorizedUser()

	except PyJWTError:
		raise UnauthorizedUser()

	internal_user = await db_client.get_user_by_internal_sub_id(internal_sub_id)

	if internal_user is None:
		raise UnauthorizedUser()

	return internal_user
