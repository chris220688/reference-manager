from aiocache import Cache
import sentry_sdk

from producer import config
from producer.db_clients import get_db_client


if config.SENTRY_ENABLED:
	# Initialize sentry SDK
	sentry_sdk.init(config.SENTRY_ENDPOINT, debug=True)

# Initialize cache
cache = Cache()
# Initialize db client
db_client = get_db_client((config.DATABASE_TYPE))
