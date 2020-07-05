import logging
from contextlog import config


logger = logging.getLogger(config.APP_NAME)
logger.setLevel(logging.INFO)

logging_format = "%(asctime)s %(levelname)s %(name)s %(message)s"
formatter = logging.Formatter(logging_format)

# Create handlers for console logger
file_handler = logging.handlers.TimedRotatingFileHandler(f"logs/{config.APP_NAME}.log", when="midnight", interval=1)
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
