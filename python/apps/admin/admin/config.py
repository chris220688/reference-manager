import os

# Mongo driver does funny things when running replica-set locally
# Also use LOCAL_DEPLOYMENT for CORS when running locally
LOCAL_DEPLOYMENT = True if os.getenv("LOCAL_DEPLOYMENT", "false") == "true" else False

# Supported database types by name
MONGO_DB = "mongodb"

# Selected database type to use
DATABASE_TYPE = os.getenv("DATABASE_TYPE")

# MongoDB Replica Set
MONGODB_HOST = os.getenv("DATABASE_HOST")
MONGODB_PORT = int(os.getenv("DATABASE_PORT"))
MONGODB_USERNAME = os.getenv("DATABASE_USERNAME")
MONGODB_PASSWORD = os.getenv("DATABASE_PASSWORD")
MONGODB_DATABASE = os.getenv("DATABASE_NAME")
MONGODB_REPLICASET = "rs0"
MONGODB_REFERENCE_MANAGER_COLLECTION = "referencemanager"

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", None)
ALGORITHM = os.environ.get("ALGORITHM", None)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
ACCESS_COOKIE_EXPIRE_SECONDS = int(os.environ.get("ACCESS_COOKIE_EXPIRE_SECONDS", 900))
HOME_URL="http://localhost:8000/"
LOGIN_URL="http://localhost:8000/login"

# Sentry configuration
# SENTRY_ENABLED = True if not LOCAL_DEPLOYMENT else False
# SENTRY_ENDPOINT = os.environ.get("SENTRY_ENDPOINT", None)
