import sentry_sdk

if config.SENTRY_ENABLED:
	# Initialize sentry SDK
	sentry_sdk.init(config.SENTRY_ENDPOINT)
