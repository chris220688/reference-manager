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
from starlette.responses import RedirectResponse
from oauthlib.oauth2 import WebApplicationClient

from contextlog import contextlog
from producer import config
from producer.db_clients import get_db_client
from producer.exceptions import (
	exception_handling,
	DatabaseConnectionError,
	DocumentExists,
)
from producer.models import (
	Reference,
	ReferenceMetadata,
)


logger = contextlog.get_contextlog()

app = FastAPI()

# OAuth 2 client setup
client = WebApplicationClient(config.GOOGLE_CLIENT_ID)

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
			creation_date=datetime.datetime.now()
		)

		await db_client.insert(reference, metadata)

@app.get("/google-login-redirect/")
async def google_login_redirect(request: Request):
	""" Redirects the user to the Google authentication popup """
	discovery_document = await _get_discovery_document()
	authorization_endpoint = discovery_document["authorization_endpoint"]

	request_uri = client.prepare_request_uri(
		authorization_endpoint,
		redirect_uri=config.GOOGLE_REDIRECT_URL,
		scope=["openid", "email", "profile"],
	)

	return RedirectResponse(url=request_uri)

@app.get("/google-login-callback/")
async def google_login_callback(request: Request):
	""" Callback triggered when the user logs in to the Google pop-up.

		Receives an authentication_token from Google which then
		exchanges for an access_token. The latter is used to
		gain user information from Google's userinfo_endpoint.
	"""
	auth_code = request.query_params.get("code")

	discovery_document = await _get_discovery_document()
	token_endpoint = discovery_document["token_endpoint"]
	userinfo_endpoint = discovery_document["userinfo_endpoint"]

	# Request access_token from Google
	token_url, headers, body = client.prepare_token_request(
		token_endpoint,
		redirect_url=config.GOOGLE_REDIRECT_URL,
		code=auth_code
	)
	token_response = requests.post(
		token_url,
		headers=headers,
		data=body,
		auth=(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET),
	)

	client.parse_request_body_response(json.dumps(token_response.json()))

	# Request user's information from Google
	uri, headers, body = client.add_token(userinfo_endpoint)
	userinfo_response = requests.get(uri, headers=headers, data=body)

	if userinfo_response.json().get("email_verified"):
		subject_id = userinfo_response.json()["sub"]
		user_email = userinfo_response.json()["email"]
		user_name = userinfo_response.json()["given_name"]
	else:
		raise HTTPException(
			status_code=400,
			detail="User email not verified by Google."
		)

	logger.info(f"user_email: {user_email}")
	logger.info(f"user_name: {user_name}")

async def _get_discovery_document():
	""" Returns the openid configuration information from Google """
	return requests.get(config.GOOGLE_DISCOVERY_URL).json()
