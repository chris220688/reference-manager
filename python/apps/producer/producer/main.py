from fastapi import FastAPI, Query

from contextlog import contextlog
from producer import config
from producer.db_clients import get_db_client
from producer.models import Reference


logger = contextlog.get_contextlog()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
	logger.info("Starting up producer service")
	global db_client

	db_client = await get_db_client(config.DATABASE_TYPE)
	await db_client.start_session()


@app.on_event("shutdown")
async def shutdown_event():
	await db_client.end_session()
	await db_client.close_connection()
	logger.info("Shutting down producer service")


@app.post(config.INSERT_ENDPOINT)
async def insert(reference: Reference):
	""" API endpoint for inserting a new reference in the database """
	logger.info(f"Received - {reference.dict()}")

	await db_client.insert(reference.dict())
