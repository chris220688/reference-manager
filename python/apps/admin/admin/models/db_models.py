import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, conint, conlist, constr


class BookSection(BaseModel):
	""" The pages within which the reference is found in a book """
	starting_page: conint(gt=0, lt=10000)
	ending_page: conint(gt=0, lt=10000)


class BookLinkType(str, Enum):
	amazon = "amazon"
	book_depository = "bookdepository"
	waterstones = "waterstones"


class BookLink(BaseModel):
	""" An affiliate link for the book """
	link_type: BookLinkType
	link_url: str


class Book(BaseModel):
	""" A book containing a reference """
	name: constr(min_length=5, max_length=100)
	author: constr(min_length=5, max_length=50)
	book_sections: conlist(BookSection, min_items=1, max_items=100)
	book_links: Optional[conlist(BookLink)]


class Category(str, Enum):
	arts = "arts"
	business = "business"
	computer_science = "computer_science"
	food_drinks = "food_drinks"
	health = "health"
	history = "history"
	literature = "literature"
	sciences = "sciences"
	social_sciences = "social_sciences"
	sports = "sports"
	technology = "technology"
	travel = "travel"
	other = "other"


class Rating(BaseModel):
	positive: conint(gt=-1)
	negative: conint(gt=-1)


class Reference(BaseModel):
	""" A reference of an event """
	reference_id: Optional[constr(min_length=36, max_length=36)]
	title: constr(min_length=5, max_length=100)
	category: Category
	description: constr(min_length=30, max_length=600)
	books: conlist(Book, min_items=1, max_items=50)
	rating: Optional[Rating]


class ReferenceMetadata(BaseModel):
	""" Reference metadata """
	created_at: datetime.datetime
	author_id: str


class RatingOptions(str, Enum):
	thumbs_up = "thumbs_up"
	thumbs_down = "thumbs_down"
	not_rated = "not_rated"


class UserRating(BaseModel):
	rating = RatingOptions


class InternalUser(BaseModel):
	external_sub_id: str
	internal_sub_id: str
	username: str
	is_author: bool
	requested_join: bool
	bookmarked_references: list
	rated_references: Optional[Dict[str, UserRating.rating]]
	created_at: datetime.datetime
