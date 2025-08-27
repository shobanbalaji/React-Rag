from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class chatModel(BaseModel):
    UId: str
    chatName: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class conversationModel(BaseModel):
    UId: str
    chatId: str
    message: str
    response: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    isRag: bool


class conversationResponseModel(BaseModel):
    chatId:str
    request:str
    response:str
    createdAt:datetime
    updatedAt:datetime