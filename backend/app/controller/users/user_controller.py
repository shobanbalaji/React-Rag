from app.mongo import get_db

def get_current_user():
    db = get_db()
    collection = db["users"]
    
    users = []
    for doc in collection.find():
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to str
        users.append(doc)
        
    return {"users": users}
