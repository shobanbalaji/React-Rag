from app.mongo import get_db
from app.models.chat.chat_model import chatModel, conversationModel
from app.controller.utility.common import clean_object_ids

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
            # code will below..

            # structure and validate the payload
            payload = {
                "UId": userId,
                "chatId": chatId if chatId else cleaned_chat_response._id,
                "message": message,
                "response": "hello there !",
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
        chats = db["chat"].find({"UId": userId})  # returns a cursor

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
