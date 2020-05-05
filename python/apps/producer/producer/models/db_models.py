import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, conint, conlist, constr


class BookSection(BaseModel):
	""" The pages within which the reference is found in a book """
	starting_page: conint(gt=0, lt=10000)
	ending_page: conint(gt=0, lt=10000)


class Book(BaseModel):
	""" A book containing a reference """
	name: constr(min_length=5, max_length=100)
	book_sections: conlist(BookSection, min_items=1, max_items=100)


class Reference(BaseModel):
	""" A reference of an event """
	title: constr(min_length=5, max_length=100)
	event_date: datetime.datetime
	description: constr(min_length=50, max_length=300)
	books: conlist(Book, min_items=1, max_items=50)
	rating: Optional[conint(gt=0, lt=6)]


class ReferenceMetadata(BaseModel):
	""" Reference metadata """
	created_at: datetime.datetime
	user_name: Optional[str]  # Requires auth to be implemented
	user_email: Optional[str] # Requires auth to be implemented

class InternalUser(BaseModel):
	external_sub_id: str
	internal_sub_id: str
	created_at: datetime.datetime
