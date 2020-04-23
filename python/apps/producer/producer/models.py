import datetime
from typing import List

from pydantic import BaseModel


class Reference(BaseModel):
	title: str
	date: datetime.datetime
	description: str
	book: str
	pages: List[int]
	rating: int
