from fastapi import FastAPI, Query
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

from consumer import config


client = Elasticsearch([config.ELASTICSEARCH_HOST])

app = FastAPI()


@app.get("/")
async def index():
	return "Hello"


@app.get("/auto_complete/")
async def search(search_string: str = Query(..., min_length=3)):
	return {"search_string": search_string}


@app.get("/search/")
async def search(search_string: str = Query(..., min_length=3)):
	s = Search().using(client).query("match", title=search_string)
	return [t for t in s]
