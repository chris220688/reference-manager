import datetime
import time
from typing import Optional
from uuid import uuid4

from fastapi import (
	Depends,
	FastAPI,
	Form,
	Request,
	status,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import (
	JSONResponse,
	HTMLResponse,
	RedirectResponse,
	Response,
)
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
#from sentry_sdk import capture_message

from contextlog import contextlog
from admin import config
from admin import db_client
from admin.exceptions import (
	AuthorizationException,
	DocumentExists,
	exception_handling,
)
from admin.auth import (
	schemes as auth_schemes,
	util as auth_util,
)
from admin.models.auth_models import (
	AccessTokenData,
	AdminUser,
	FilterReferencesRequest,
	FilterUsersRequest,
	LoginRequest,
	UpdateReferenceLinkRequest,
	UpdateUserRequest,
)
from admin.models.db_models import (
	Category,
	Reference,
	ReferenceMetadata,
	RatingOptions,
	InternalUser,
)


logger = contextlog.get_contextlog()

app = FastAPI()

access_token_cookie_scheme = auth_schemes.AccessTokenCookieBearer()


# Allow CORS only locally
# if config.LOCAL_DEPLOYMENT:
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

@app.on_event("startup")
async def startup_event():
	""" Startup functionality """
	logger.info("Starting up admin service")

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
async def setup_request(request: Request, call_next) -> HTMLResponse:
	""" A middleware for setting up a request. It creates a new request_id
		and adds some basic metrics.

		Args:
			request: The incoming request
			call_next (obj): The wrapper as per FastAPI docs

		Returns:
			response: The HTML response
	"""
	contextlog.REQUEST_ID.set(str(uuid4()))

	start_time = time.time()

	response = await call_next(request)

	process_time = str(round(time.time() - start_time, 3))
	logger.info(f"Request took {process_time}s")

	return response


@app.post("/login")
async def login(
	login_request: LoginRequest,
):
	async with exception_handling():

		await auth_util.validate_user_credentials(login_request.username, login_request.password)

		access_token = await auth_util.create_access_token(
			AccessTokenData(
				sub=login_request.username,
			)
		)

		response = RedirectResponse(url=config.HOME_URL, status_code=status.HTTP_302_FOUND)

		#secure_cookie = False if config.LOCAL_DEPLOYMENT else True
		response.set_cookie(
			key="access_token",
			value=f"Bearer {access_token}",
			httponly=True,
			secure=False,
			max_age=config.ACCESS_COOKIE_EXPIRE_SECONDS,
		)

	return response


@app.get("/logout")
async def read_private(
	admin_user: AdminUser = Depends(access_token_cookie_scheme)
):
	async with exception_handling():
		response = RedirectResponse(url=config.HOME_URL)
		response.delete_cookie(key="access_token")
		return response


@app.get("/user-session-status/")
async def user_session_status(
	request: Request,
	admin_user: AdminUser = Depends(access_token_cookie_scheme),
) -> JSONResponse:
	async with exception_handling():
		logged_in = True if admin_user else False

		response = JSONResponse(
			content=jsonable_encoder({
				"userLoggedIn": logged_in,
			}),
		)

		return response


@app.post("/users")
async def get_users(
	filter_users_request: FilterUsersRequest,
	admin_user: AdminUser = Depends(access_token_cookie_scheme),
):
	async with exception_handling():
		users = await db_client.get_users(
			requested_join=filter_users_request.requested_join,
			is_author=filter_users_request.is_author
		)

		response = JSONResponse(
			content=jsonable_encoder({
				"users": users,
			}),
		)

		return response


@app.post("/user")
async def update_user(
	update_user_request: UpdateUserRequest,
	admin_user: AdminUser = Depends(access_token_cookie_scheme),
):
	async with exception_handling():
		modified = await db_client.update_user(
			internal_sub_id=update_user_request.internal_sub_id,
			requested_join=update_user_request.requested_join,
			is_author=update_user_request.is_author,
		)

		response = JSONResponse(
			content=jsonable_encoder({
				"success": modified,
			}),
		)

		return response


@app.post("/references")
async def get_references(
	filter_references_request: FilterReferencesRequest,
	admin_user: AdminUser = Depends(access_token_cookie_scheme),
):
	async with exception_handling():
		references = await db_client.get_references(
			has_amazon_links=filter_references_request.has_amazon_links,
			has_waterstones_links=filter_references_request.has_waterstones_links,
			has_bookdepository_links=filter_references_request.has_bookdepository_links,
		)

		response = JSONResponse(
			content=jsonable_encoder({
				"references": references,
			}),
		)

		return response


@app.post("/reference")
async def update_reference_link(
	update_reference_link_request: UpdateReferenceLinkRequest,
	admin_user: AdminUser = Depends(access_token_cookie_scheme),
):
	async with exception_handling():
		modified = await db_client.update_reference_link(
			reference_id=update_reference_link_request.reference_id,
			book_name=update_reference_link_request.book_name,
			link_type=update_reference_link_request.link_type,
			link_url=update_reference_link_request.link_url,
		)

		response = JSONResponse(
			content=jsonable_encoder({
				"success": modified,
			}),
		)

		return response
