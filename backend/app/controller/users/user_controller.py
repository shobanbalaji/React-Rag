from app.mongo import get_db
from app.controller.utility.common import add_document, check_document_exist
from app.models.index import createUserModel

db = get_db()

def get_current_user():
    collection = db["users"] 
    users = []
    for doc in collection.find():
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to str
        users.append(doc)
        
    return {"users": users}


def create_user(payload):
    collectionName = "users"
    payloadValue = payload.dict()
    
    # check the user already exist 
    checkEmailExit = check_document_exist(collection_name="users", key="email", value=payloadValue["email"])
    if checkEmailExit["success"]:
        return {"success":False, "message":"This user mail already exist", "data":None}
    
    # create user
    createUser = add_document(collectionName=collectionName, document=payloadValue, model=createUserModel)
    # Check if creation succeeded
    if createUser:
        return {
            "success": True,
            "message": "User created successfully.",
            "data": {
                **payloadValue,
                "_id": str(createUser)
            }
        }
    else:
        return {
            "success": False,
            "message": "Failed to create user.",
            "data": None
        }

    