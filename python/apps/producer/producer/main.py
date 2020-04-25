import datetime
import time
from uuid import uuid4

from fastapi import (
	FastAPI,
	Query,
	Request,
)

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

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.put(config.INSERT_ENDPOINT)
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
