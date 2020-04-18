from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, MultiSearch

import ndjson
import json

from consumer import config


client = Elasticsearch([config.ELASTICSEARCH_HOST])

app = FastAPI()


@app.get("/")
async def index():
	return "Hello"


@app.get("/auto_complete/")
async def search(search_string: str = Query(..., min_length=3)):
	return {"search_string": search_string}


@app.post("/search/referencemanager/_msearch/")
async def search(request: Request):
	print(request.headers['content-type'])

	ms = MultiSearch(using=client, index='referencemanager.referencemanager')

	body = await request.body()

	decoded_body = ndjson.loads(body)

	params = None
	for item in decoded_body:
		if item and 'query' not in item:
			# This has to be a header (param)
			params = item
			continue
		else:
			# This has to be the query
			search = Search().update_from_dict(item)

			if params is not None:
				search = search.params(**params)
				params = None

			ms = ms.add(search)

	response = ms.execute()

	responses = {'responses': []}

	print(ms.to_dict())

	for item in response:
		responses['responses'].append(item.to_dict())

	print(response)

	return JSONResponse(content=responses)
