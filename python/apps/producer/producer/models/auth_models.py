import datetime
from typing import List, Optional

from pydantic import BaseModel


class ExternalAuthToken(BaseModel):
	code: str


class InternalAccessTokenData(BaseModel):
	sub: str
	username: str


class ExternalUser(BaseModel):
	username: str
	sub_id: str
