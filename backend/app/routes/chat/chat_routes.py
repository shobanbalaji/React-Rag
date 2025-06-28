from fastapi import APIRouter, Header, Body, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.controller.chat.chat_controller import retrieveUserChats, createChatRequest
router = APIRouter()


class ChatPayload(BaseModel):
    message: Optional[str] = None
    c_id:Optional[str] = None

@router.delete("/deleteChat")
async def deleteChat():
    return "chat deleted"

@router.post("/createChat")
async def createChat(userId: str = Header(..., convert_underscores=False), payload: ChatPayload =Body(...) ):
    return await createChatRequest(userId, payload.message, payload.c_id)

@router.patch("/renameChat")
async def deleteChat():
    return "chat Rename"

@router.post("/chatRequest")
async def chatRequest(userId: str = Header(..., convert_underscores=False), payload: ChatPayload =Body(...)):
    return await createChatRequest(userId, payload.message, payload.c_id)

@router.get("/getChat")
async def chatRequest(userId: str = Header(..., convert_underscores=False)):  
    return  await  retrieveUserChats(userId)