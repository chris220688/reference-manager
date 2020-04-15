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
