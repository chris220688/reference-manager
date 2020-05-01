import os


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

# Google login
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)
GOOGLE_REDIRECT_URL = os.environ.get("GOOGLE_REDIRECT_URL", None)
