import os

# Mongo driver does funny things when running replica-set locally
# Also use LOCAL_DEPLOYMENT for CORS when running locally
LOCAL_DEPLOYMENT = True if os.getenv("LOCAL_DEPLOYMENT", "false") == "true" else False

# Supported database types by name
MONGO_DB = "mongodb"

# Supported authentication providers by name
GOOGLE = "google-oidc"
AZURE = "azure-oidc"

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

# Azure login
AZURE_CLIENT_ID = os.environ.get("AZURE_CLIENT_ID", None)
AZURE_CLIENT_SECRET = os.environ.get("AZURE_CLIENT_SECRET", None)
AZURE_TENANT_ID = os.environ.get("AZURE_TENANT_ID", None)
AZURE_AUTHORITY = f"https://login.microsoftonline.com/common"
AZURE_DISCOVERY_URL = os.environ.get("AZURE_DISCOVERY_URL", None)
AZURE_REDIRECT_URL = os.environ.get("AZURE_REDIRECT_URL", None)

# Front end endpoint
FRONTEND_URL = os.environ.get("FRONTEND_URL", None)

# JWT access token configuration
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", None)
ALGORITHM = os.environ.get("ALGORITHM", None)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
AUTH_TOKEN_EXPIRE_MINUTES = int(os.environ.get("AUTH_TOKEN_EXPIRE_MINUTES", 1))

# Sentry configuration
SENTRY_ENABLED = True if not LOCAL_DEPLOYMENT else False
SENTRY_ENDPOINT = os.environ.get("SENTRY_ENDPOINT", None)
