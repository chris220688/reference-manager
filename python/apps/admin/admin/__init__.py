# import sentry_sdk

from admin import config
from admin.db_clients import get_db_client


# if config.SENTRY_ENABLED:
# 	# Initialize sentry SDK
# 	sentry_sdk.init(config.SENTRY_ENDPOINT)

# Initialize db client
db_client = get_db_client((config.DATABASE_TYPE))
