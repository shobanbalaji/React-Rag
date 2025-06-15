from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class createUserModel(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    userName: str = Field(..., min_length=3, description="User's display name")