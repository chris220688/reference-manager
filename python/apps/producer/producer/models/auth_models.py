import datetime
from typing import List, Optional

from pydantic import BaseModel


class InternalAuthToken(BaseModel):
	code: str

class ExternalAuthToken(BaseModel):
	code: str


class InternalAccessTokenData(BaseModel):
	sub: str
	username: str


class ExternalUser(BaseModel):
	username: str
	external_sub_id: str
