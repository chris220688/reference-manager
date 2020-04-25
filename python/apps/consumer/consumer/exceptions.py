from contextlib import asynccontextmanager
from contextlog import contextlog

from fastapi import HTTPException


logger = contextlog.get_contextlog()

class ElasticSearchException(Exception):
	pass


class ElasticSearchConnectionError(ElasticSearchException):
	pass


@asynccontextmanager
async def exception_handling():
	try:
		yield
	except ElasticSearchConnectionError as exc:
		logger.exception(f"Failed to connect to elastic search server: {repr(exc)}")
		raise HTTPException(status_code=500, detail="Cannot serve results at the moment. Please try again.")
	except Exception as exc:
		logger.exception(repr(exc))
		raise HTTPException(status_code=500, detail="An error has occurred. Please try again.")
