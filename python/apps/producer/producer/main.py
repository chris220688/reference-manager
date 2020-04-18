from fastapi import FastAPI, Query
from pydantic import BaseModel

from producer import config
from producer.db_clients import get_db_client


app = FastAPI()

@app.on_event("startup")
async def startup_event():
	global db_client

	db_client = await get_db_client(config.DATABASE_TYPE)
	await db_client.start_session()


@app.on_event("shutdown")
async def shutdown_event():
    await db_client.end_session()
    await db_client.close_connection()


@app.get("/")
async def index():
	return "Hello"


@app.get("/insert/")
async def insert(title: str = Query(..., min_length=5)):
	await db_client.insert({'title': title})
