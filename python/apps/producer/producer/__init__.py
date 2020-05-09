from aiocache import Cache

from producer import config
from producer.db_clients import get_db_client


# Initialize cache
cache = Cache()
# Initialize db client
db_client = get_db_client((config.DATABASE_TYPE))
