from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class createUser(BaseModel):
    email:EmailStr
    password: str=Field(min_length=8)