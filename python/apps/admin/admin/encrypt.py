import hashlib
from passlib.hash import bcrypt


def encrypt_password(username: str, password: str) -> str:
	""" It encrypts the password of the admin user.

		Args:
			username: Username
			password: Password

		Returns:
			encrypted_password: The encrypted password
	"""
	salt = username.lower()
	salt = salt.replace(" ", "")
	# Hash the salt so that the password is not plain text visible in the database
	salt = hashlib.sha256(salt.encode()).hexdigest()
	# bcrypt requires a 22 char salt
	if len(salt) > 21:
		salt = salt[:21]

	# As per passlib the last character of the salt should always be one of [.Oeu]
	salt = salt + "O"

	encrypted_password = bcrypt.using(salt=salt).hash(password)
	return encrypted_password

print(encrypt_password(username="", password=""))
