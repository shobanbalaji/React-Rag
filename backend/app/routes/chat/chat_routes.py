from fastapi import APIRouter, Header, Body, Query, Path, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.controller.chat.chat_controller import retrieveUserChats, createChatRequest, retrieveUserConversations, renameChat, deleteChat
router = APIRouter()


class ChatPayload(BaseModel):
    message: Optional[str] = None
    c_id:Optional[str] = None
    
class ChatRenamePayload(BaseModel):
    c_n: Optional[str] = None
    c_id:Optional[str] = None  
    

@router.delete("/deleteChat/{chat_id}")
async def deleteChats(userId:str = Header(..., convert_underscores = False), chat_id: str = Path(...),):
    return await deleteChat(userId, chat_id)

@router.post("/createChat")
async def createChat(userId: str = Header(..., convert_underscores=False), payload: ChatPayload = Body(...) ):
    return await createChatRequest(userId, payload.message, payload.c_id)

@router.patch("/renameChat")
async def renameChats(userId: str = Header(..., convert_underscores=False), payload:ChatRenamePayload=Body(...)):
    return await renameChat(userId, payload.c_id, payload.c_n)

@router.post("/chatRequest")
async def chatRequest(userId: str = Header(..., convert_underscores=False), payload: ChatPayload = Body(...)):
    return await createChatRequest(userId, payload.message, payload.c_id)

@router.get("/getChat")
async def chatRequest(userId: str = Header(..., convert_underscores=False)):  
    return  await  retrieveUserChats(userId)

@router.get('/fetchChats')
async def fetchChats(userId:str = Header(..., convert_underScores=False), c_id:str=Query(...,convert_underScores=False)):
    print(userId,c_id)
    return await retrieveUserConversations(userId, chatId=c_id)