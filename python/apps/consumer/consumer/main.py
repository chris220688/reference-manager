"""
	This is FastAPI service that acts as a proxy between
	the frontend and the elasticsearch cluster.

	Requests are received, validated and forwarded to
	elasticsearch using the elasticsearch_dsl library.
"""
from contextlib import contextmanager
from contextvars import ContextVar
import logging
import ndjson
import time
from uuid import uuid4

from elasticsearch import Elasticsearch
from elasticsearch_dsl import MultiSearch, Search
from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from consumer import config
from contextlog import contextlog


logger = contextlog.get_contextlog()

client = Elasticsearch([config.ELASTICSEARCH_HOST], max_retries=3)
app = FastAPI()

@app.on_event("startup")
async def startup_event():
	logger.info("Starting up consumer service")


@app.on_event("shutdown")
async def shutdown_event():
	logger.info("Shutting down consumer service")


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


@app.post(config.MSEARCH_ENDPOINT)
async def msearch(request: Request):
	""" API endpoint for making a search request to elasticsearch's
		'_msearch' endpoint.

		NOTE: The body might be ndjson object, including multiple
		json objects. Needs to be parsed in order to reconstruct
		a new elasticsearch request, compatible with the
		elasticsearch_dsl library.

		Args:
			request (fastapi.Request): The incoming request

		Returns:
			response (fastapi.responses.JSONResponse): The json response
	"""
	ms = MultiSearch(using=client, index=config.ELASTICSEARCH_INDEX)

	# Decode the body of the request
	body = await request.body()
	decoded_body = ndjson.loads(body)

	logger.info(f"Received - {decoded_body}")

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

	logger.info(f"Requested - {ms.to_dict()}")

	try:
		response = ms.execute()
	except Exception as exc:
		logger.exception(exc)
		raise HTTPException(
			status_code=500,
			detail="Cannot serve results at the moment. Please try again."
		)

	responses = {'responses': []}

	for item in response:
		responses['responses'].append(item.to_dict())

	logger.info(f"Responded - {response}")

	return JSONResponse(content=responses)
