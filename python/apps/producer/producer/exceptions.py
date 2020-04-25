from contextlib import asynccontextmanager
from contextlog import contextlog

from fastapi import HTTPException


logger = contextlog.get_contextlog()

class DatabaseException(Exception):
	pass


class UnknownDatabaseType(DatabaseException):
	pass


class DatabaseConnectionError(DatabaseException):
	pass


class DocumentExists(DatabaseException):
    def __init__(self, title):
        super(DocumentExists, self).__init__()
        self.title = title


@asynccontextmanager
async def exception_handling():
	try:
		yield
	except DatabaseConnectionError as exc:
		logger.exception(f"Failed to connect to the database: {repr(exc)}")
		raise HTTPException(status_code=500, detail="Cannot serve results at the moment. Please try again.")
	except UnknownDatabaseType as exc:
		logger.exception(f"Failed to create database client: {repr(exc)}")
		raise HTTPException(status_code=500, detail="Cannot serve results at the moment. Please try again.")
	except DocumentExists as exc:
		logger.warning(f"Failed to insert document: {repr(exc)}")
		raise HTTPException(status_code=409, detail=f"Reference '{exc.title}' exists.")
	except Exception as exc:
		logger.exception(repr(exc))
		raise HTTPException(status_code=500, detail="An error has occurred. Please try again.")
