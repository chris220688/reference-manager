from contextvars import ContextVar
import logging
from uuid import uuid4

from contextlog import config


# Context variable for handling request_ids
REQUEST_ID = ContextVar('request_id', default=str(uuid4()))

class LoggingAdapter(logging.LoggerAdapter):
	""" Custom logging adapter for injecting request ids. """
	def process(self, msg, kwargs):
		return '[%s] %s' % (REQUEST_ID.get(), msg), kwargs


def get_contextlog():
	""" Returns a custom logger wrapped in adapter for dynamic
		injection of context variables (request_ids).
	"""
	logger = logging.getLogger(config.APP_NAME)
	clogger = LoggingAdapter(logger, {})

	return clogger
