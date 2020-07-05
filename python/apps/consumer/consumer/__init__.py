import sentry_sdk

from consumer import config


if config.SENTRY_ENABLED:
	# Initialize sentry SDK
	sentry_sdk.init(config.SENTRY_ENDPOINT)
