from typing import Optional

from pydantic import BaseModel, constr


class AdminUser(BaseModel):
	username: str
	password: str


class AccessTokenData(BaseModel):
	sub: str


class LoginRequest(BaseModel):
	username: constr(min_length=4)
	password: constr(min_length=4)


class FilterOptions(BaseModel):
	filter_yes = 1
	filter_no = 2


class FilterUsersRequest(BaseModel):
	requested_join: Optional[int]
	is_author: Optional[int]


class UpdateUserRequest(BaseModel):
	internal_sub_id: constr(min_length=36)
	requested_join: Optional[bool]
	is_author: Optional[bool]


class FilterReferencesRequest(BaseModel):
	has_amazon_links: Optional[int]
	has_waterstones_links: Optional[int]
	has_bookdepository_links: Optional[int]


class UpdateReferenceLinkRequest(BaseModel):
	reference_id: constr(min_length=36)
	book_name: str
	link_type: str
	link_url: str