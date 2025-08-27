from app.mongo import get_db
from app.controller.utility.common import add_document
from app.models.index import createUserModel

db = get_db()

def get_current_user():
    collection = db["users"] 
    users = []
    for doc in collection.find():
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to str
        users.append(doc)
        
    return {"users": users}


async def create_user(payload):
    collectionName = "users"
    payloadValue = payload.dict()
    return await add_document(collectionName=collectionName, document=payloadValue, model=createUserModel)