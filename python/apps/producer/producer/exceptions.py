class DatabaseException(Exception):
	pass


class UnknownDatabaseType(DatabaseException):
	pass


class ConnectionError(DatabaseException):
	pass
