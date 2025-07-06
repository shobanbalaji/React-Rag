from app.mongo import get_db
from pymongo import DESCENDING
from app.models.chat.chat_model import chatModel, conversationModel, conversationResponseModel
from app.controller.utility.common import clean_object_ids
from app.controller.gemini.utilityGemini import geminiResponse
from bson import ObjectId
db = get_db()


# create conversation
async def createChatRequest(userId, message, chatId):
    try:
        # if chat id exist does not create a chat
        if chatId == "auto":
            # structure and validate the payload
            payload = {"UId": userId, "chatName": "New Chat"}
            validate_chat_payload = chatModel(**payload).dict()
            create_chat = db["chat"].insert_one(validate_chat_payload)
            response_data = {"_id": create_chat.inserted_id, **validate_chat_payload}
            cleaned_chat_response = clean_object_ids(response_data)

            # return {
            #   "code": 200,
            #   "message": "chat Created",
            #   "success": True,
            #   "data":clean_object_ids(response_data)
            # }

        if message:

            # get response from Gemini API
            request_gemini = await geminiResponse(message)

            # structure and validate the payload
            payload = {
                "UId": userId,
                "chatId": chatId if chatId and chatId != "auto" else cleaned_chat_response["_id"],
                "message": message,
                "response": request_gemini,
                "isRag": False,
            }
            validate_conversation_payload = conversationModel(**payload).dict()
            create_message = db["conversation"].insert_one(
                validate_conversation_payload
            )
            response_data = {
                "_id": create_message.inserted_id,
                **validate_conversation_payload,
            }
            return {
                "code": 200,
                "message": "conversation response",
                "success": True,
                "data": clean_object_ids(response_data),
            }

    except Exception as e:
        print("An exception occurred", e)
        return {"code": 500, "message": "Request Failed", "success": False, "data": {}}


async def retrieveUserChats(userId):
    try:
        chats = db["chat"].find({"UId": userId}).sort("createdAt", DESCENDING)

        chat_list = [{**chat, "_id": str(chat["_id"])} for chat in chats]

        return {
            "code": 200,
            "message": "User chats retrieved",
            "success": True,
            "data": chat_list,
        }

    except Exception as e:
        print("An exception occurred:", e)
        return {
            "code": 500,
            "message": "Failed to retrieve chats",
            "success": False,
            "data": [],
        }


async def retrieveUserConversations(userId, chatId):
    try:
      ref = db["conversation"]
      responses = ref.find({"UId":userId, "chatId":chatId})
      return {
          "data":[{**response, "_id": str(response["_id"])} for response in responses]
      }
    except Exception as e:
      print('An exception occurred')
      
      
# rename chat name
async def renameChat(userId, chatId, chatName):
    try:
      chats = db["chat"]
      response = chats.update_one(
            {"_id": ObjectId(chatId), "UId": userId}, 
            {"$set": {"chatName": chatName}}           
        )
      return{
          "code":200,
          "success":True,
          "data":{"value":chatName},
          "message":"Rename Successful"
      }
    except Exception as e:
      print('An exception occurred')
      return{
          "code":500,
          "success":False,
          "message":"Rename failed"
      }
      
      
# delete chat based on id and user id
async def deleteChat(userId, chatId):
    try:
      chatRef = db["chat"]
      deleteChat = chatRef.delete_one({"_id": ObjectId(chatId), "UId": userId})
      if deleteChat.deleted_count == 1:
        print("Chat deleted successfully.")
        return{
          "code":200,
          "success":True,
          "data":{"value":chatId},
          "message":"Chat deleted successful"
      }
      else:
        print("No chat found or unauthorized.")
        return{
          "code":500,
          "success":False,
          "message":"Failed to delete chat"
      }
    except Exception as e:
      print('An exception occurred')
      return{
          "code":500,
          "success":False,
          "message":"Failed to delete chat"
      }