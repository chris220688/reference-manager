import logging
from contextvars import ContextVar
from consumer import config
from uuid import uuid4


# Context variable for handling request_ids
REQUEST_ID = ContextVar('request_id', default=str(uuid4()))

class LoggingAdapter(logging.LoggerAdapter):
	""" Custom logging adapter for injecting request ids. """
	def process(self, msg, kwargs):
		return '[%s] %s' % (REQUEST_ID.get(), msg), kwargs


logger = logging.getLogger(config.APP_NAME)
logger.setLevel(logging.INFO)

logging_format = "%(asctime)s %(levelname)s %(name)s %(message)s"
formatter = logging.Formatter(logging_format)

# Create handlers for console logger
file_handler = logging.handlers.TimedRotatingFileHandler(f"{config.APP_NAME}.log", when="midnight", interval=1)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter)
file_handler.suffix = "%Y%m%d"
logger.addHandler(file_handler)

# Create handlers for file logger
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Suppress duplicate logs from uvicorn logger
logger.propagate = False

# Custom logger wrapped in adapter for dynamic injection
# of context variables (request_ids)
clogger = LoggingAdapter(logger, {})
