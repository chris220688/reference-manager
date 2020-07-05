import datetime
import time
from uuid import uuid4

from fastapi import (
	Depends,
	FastAPI,
	Request,
	status,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import (
	JSONResponse,
	RedirectResponse,
	Response,
)

from contextlog import contextlog
from producer.auth import (
	providers as auth_providers,
	schemes as auth_schemes,
	util as auth_util,
)

from producer import config
from producer import db_client
from producer.exceptions import (
	AuthorizationException,
	DocumentExists,
	exception_handling,
)
from producer.models.db_models import (
	Category,
	InternalUser,
	Reference,
	ReferenceMetadata,
)
from producer.models.auth_models import (
	ExternalAuthToken,
	ExternalUser,
	InternalAccessTokenData,
)


logger = contextlog.get_contextlog()

app = FastAPI()


# Allow CORS only locally
if config.LOCAL_DEPLOYMENT:
	origins = [
		"http://localhost:3000",
	]
	app.add_middleware(
		CORSMiddleware,
		allow_origins=origins,
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)


csrf_token_redirect_cookie_scheme = auth_schemes.CSRFTokenRedirectCookieBearer()
auth_token_scheme = auth_schemes.AuthTokenBearer()
access_token_cookie_scheme = auth_schemes.AccessTokenCookieBearer()


@app.on_event("startup")
async def startup_event():
	""" Startup functionality """
	logger.info("Starting up producer service")

	async with exception_handling():
		await db_client.start_session()


@app.on_event("shutdown")
async def shutdown_event():
	""" Shutdown functionality """
	logger.info("Shutting down producer service")

	async with exception_handling():
		await db_client.end_session()
		await db_client.close_connection()


@app.middleware("http")
async def setup_request(request: Request, call_next) -> JSONResponse:
	""" A middleware for setting up a request. It creates a new request_id
		and adds some basic metrics.

		Args:
			request: The incoming request
			call_next (obj): The wrapper as per FastAPI docs

		Returns:
			response: The JSON response
	"""
	contextlog.REQUEST_ID.set(str(uuid4()))

	start_time = time.time()

	response = await call_next(request)

	if response.status_code == status.HTTP_401_UNAUTHORIZED:
		# The is the only exception where we need to redirect
		redirect_url = f"{config.FRONTEND_URL}?error=401"
		response = RedirectResponse(url=redirect_url)

	process_time = str(round(time.time() - start_time, 3))
	logger.info(f"Request took {process_time}s")

	return response


@app.get("/login-redirect")
async def login_redirect(auth_provider: str):
	""" Redirects the user to the external authentication pop-up

		Args:
			auth_provider: The authentication provider (i.e google-iodc)

		Returns:
			Redirect response to the external provider's auth endpoint
	"""
	async with exception_handling():
		provider = await auth_providers.get_auth_provider(auth_provider)

		request_uri, state_csrf_token = await provider.get_request_uri()

		response = RedirectResponse(url=request_uri)

		secure_cookie = False if config.LOCAL_DEPLOYMENT else True
		response.set_cookie(key="state", value=f"Bearer {state_csrf_token}", httponly=True, secure=secure_cookie)

		return response


@app.get("/google-login-callback/")
async def google_login_callback(
	request: Request,
	_ = Depends(csrf_token_redirect_cookie_scheme)
):
	""" Callback triggered when the user logs in to Google's pop-up.

		Receives an authentication_token from Google which then
		exchanges for an access_token. The latter is used to
		gain user information from Google's userinfo_endpoint.

		Args:
			request: The incoming request as redirected by Google
	"""
	async with exception_handling():
		code = request.query_params.get("code")

		if not code:
			raise AuthorizationException("Missing external authentication token")

		provider = await auth_providers.get_auth_provider(config.GOOGLE)

		# Authenticate token and get user's info from external provider
		external_user = await provider.get_user(
			auth_token=ExternalAuthToken(code=code)
		)

		# Get or create the internal user
		internal_user = await db_client.get_user_by_external_sub_id(external_user)

		if internal_user is None:
			internal_user = await db_client.create_internal_user(external_user)

		internal_auth_token = await auth_util.create_internal_auth_token(internal_user)

		# Redirect the user to the home page
		redirect_url = f"{config.FRONTEND_URL}?authToken={internal_auth_token}"
		response = RedirectResponse(url=redirect_url)

		# Delete state cookie. No longer required
		response.delete_cookie(key="state")

		return response


@app.get("/azure-login-callback/")
async def azure_login_callback(
	request: Request,
	_ = Depends(csrf_token_redirect_cookie_scheme)
):
	""" Callback triggered when the user logs in to Azure's pop-up.

		Receives an authentication_token from Azure which then
		exchanges for an access_token. The latter is used to
		gain user information from Azure's userinfo_endpoint.

		Args:
			request: The incoming request as redirected by Azure
	"""
	async with exception_handling():
		code = request.query_params.get("code")

		if not code:
			raise AuthorizationException("Missing external authentication token")

		provider = await auth_providers.get_auth_provider(config.AZURE)

		# Authenticate token and get user's info from external provider
		external_user = await provider.get_user(
			auth_token=ExternalAuthToken(code=code)
		)

		# Get or create the internal user
		internal_user = await db_client.get_user_by_external_sub_id(external_user)

		if internal_user is None:
			internal_user = await db_client.create_internal_user(external_user)

		internal_auth_token = await auth_util.create_internal_auth_token(internal_user)

		# Redirect the user to the home page
		redirect_url = f"{config.FRONTEND_URL}?authToken={internal_auth_token}"
		response = RedirectResponse(url=redirect_url)

		# Delete state cookie. No longer required
		response.delete_cookie(key="state")

		return response


@app.get("/login/")
async def login(
	response: JSONResponse,
	internal_user: str = Depends(auth_token_scheme)
) -> JSONResponse:
	""" Login endpoint for authenticating a user after he has received
		an authentication token. If the token is valid it generates
		an access token and inserts it in a HTTPOnly cookie.

		Args:
			internal_auth_token: Internal authentication token

		Returns:
			response: A JSON response with the status of the user's session
	"""
	async with exception_handling():
		access_token = await auth_util.create_internal_access_token(
			InternalAccessTokenData(
				sub=internal_user.internal_sub_id,
			)
		)

		response = JSONResponse(
			content=jsonable_encoder({
				"userLoggedIn": True,
				"userName": internal_user.username,
				"isAuthor": internal_user.is_author,
				"requestedJoin": internal_user.requested_join,
			}),
		)

		secure_cookie = False if config.LOCAL_DEPLOYMENT else True

		response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True, secure=secure_cookie)

		return response


@app.get("/logout/")
async def logout(
	response: JSONResponse,
	internal_user: str = Depends(access_token_cookie_scheme)
) -> JSONResponse:
	""" Logout endpoint for deleting the HTTPOnly cookie on a users browser.

		Args:
			internal_auth_token: Internal authentication token

		Returns:
			response: A JSON response with the status of the user's session
	"""
	async with exception_handling():
		response = JSONResponse(
			content=jsonable_encoder({
				"userLoggedIn": False,
			}),
		)

		response.delete_cookie(key="access_token")

		return response


@app.get("/user-session-status/")
async def user_session_status(
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
) -> JSONResponse:
	""" User status endpoint for checking whether the user currently holds
		an HTTPOnly cookie with a valid access token.

		Args:
			internal_user: A user object that has meaning in this application

		Returns:
			response: A JSON response with the status of the user's session
	"""
	async with exception_handling():
		logged_id = True if internal_user else False

		response = JSONResponse(
			content=jsonable_encoder({
				"userLoggedIn": logged_id,
				"userName": internal_user.username,
				"isAuthor": internal_user.is_author,
				"requestedJoin": internal_user.requested_join,
			}),
		)

		return response


@app.get("/get-categories/")
async def get_categories():
	""" API endpoint for getting the available reference categories

		Returns:
			response: A JSON response including the available categories
	"""
	async with exception_handling():
		response = JSONResponse(
			content=jsonable_encoder({
				"categories": [cat.value for cat in Category.__members__.values()]
			}),
		)

		return response


@app.get("/get-references/")
async def get_references(
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for getting the references of a specific author

		Args:
			internal_user: A user objects as defined in this application

		Returns:
			response: A JSON response including the references of the user
	"""
	async with exception_handling():
		if not internal_user.is_author:
			raise UnauthorizedUser()

		references = await db_client.find_by_author(internal_user.internal_sub_id)

		response = JSONResponse(
			content=jsonable_encoder({"references": references}),
		)

		return response


@app.put("/insert-reference/")
async def insert_reference(
	reference: Reference,
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for inserting a new reference in the database

		Args:
			reference: A reference document to be inserted in the database
			internal_user: A user objects as defined in this application

		Returns:
			response: A JSON response with the inserted reference
	"""
	async with exception_handling():
		logger.info(f"Received insert request - {reference.dict()}")

		if not internal_user.is_author:
			raise UnauthorizedUser()

		title = reference.title
		existing_references = await db_client.find_by_title(title)

		if existing_references:
			for ref in existing_references:
				if reference.title == ref.title:
					raise DocumentExists(title)

		# Inject metadata related to the reference
		metadata = ReferenceMetadata(
			created_at=datetime.datetime.now(),
			author_id=internal_user.internal_sub_id,
		)

		inserted_reference = await db_client.insert_reference(reference, metadata)

		response = JSONResponse(
			content=jsonable_encoder({"reference": inserted_reference}),
		)

		return response


@app.delete("/delete-reference/")
async def delete_reference(
	reference: Reference,
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for deleting a reference from the database

		Args:
			reference: A reference document to be deleted from the database
			internal_user: A user objects as defined in this application

		Returns:
			response: A JSON response with the status deletion operation
	"""
	async with exception_handling():
		logger.info(f"Received delete request - {reference.dict()}")

		if not internal_user.is_author:
			raise UnauthorizedUser()

		if reference.reference_id:
			deleted_count = await db_client.delete_by_id(reference.reference_id)

		deleted = True if deleted_count else False

		response = JSONResponse(
			content=jsonable_encoder({"deleted": deleted}),
		)

		return response

@app.put("/join/")
async def join(
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for requested to join as an author

		Args:
			internal_user: A user objects as defined in this application
	"""
	async with exception_handling():
		requested = False

		internal_user.requested_join = True
		updated_user = await db_client.update_internal_user(internal_user)

		if updated_user:
			requested = True

		response = JSONResponse(
			content=jsonable_encoder({"requested": requested}),
		)

		return response

@app.get("/get-account/")
async def get_account(
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for getting the account details of a user

		Args:
			internal_user: A user objects as defined in this application

		Returns:
			response: A JSON response including the account details
	"""
	async with exception_handling():
		account_details = dict(
			username=internal_user.username,
			is_author=internal_user.is_author,
			requested_join=internal_user.requested_join,
			created_at=internal_user.created_at,
		)

		response = JSONResponse(
			content=jsonable_encoder(account_details),
		)

		return response

@app.delete("/delete-account/")
async def delete_account(
	internal_user: InternalUser = Depends(access_token_cookie_scheme)
):
	""" API endpoint for deleting an account

		Args:
			internal_user: A user objects as defined in this application

		Returns:
			response: A JSON response with the status deletion operation
	"""
	async with exception_handling():
		deleted_count = await db_client.delete_internal_user(internal_user)

		deleted = True if deleted_count else False

		response = JSONResponse(
			content=jsonable_encoder({"deleted": deleted}),
		)

		response.delete_cookie(key="access_token")

		return response
