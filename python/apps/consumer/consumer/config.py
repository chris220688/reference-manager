import os


# Mongo driver does funny things when running replica-set locally
# Also use LOCAL_DEPLOYMENT for CORS when running locally
LOCAL_DEPLOYMENT = True if os.getenv("LOCAL_DEPLOYMENT", "false") == "true" else False

APP_NAME = os.getenv("APP_NAME")

ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST")
ELASTICSEARCH_INDEX = os.getenv("ELASTICSEARCH_INDEX")
SEARCH_ENDPOINT = os.getenv("SEARCH_ENDPOINT")
