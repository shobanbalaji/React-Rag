from app.mongo import get_db
from pymongo.errors import PyMongoError
from bson import ObjectId
db = get_db()

async def add_document(collectionName: str, document: dict, model):
    try:
        # Collection Reference 
        collectionRef = db[collectionName]
        # Validate document using the model
        validated_data = model(**document).dict()
        # Insert into MongoDB (blocking function in async context)
        result = collectionRef.insert_one(validated_data)

        return str(result.inserted_id)
    except PyMongoError as e:
        print("MongoDB Error:", e)
        return {"status": "error", "message": str(e)}
    except Exception as e:
        print("Validation or other Error:", e)
        return {"status": "error", "message": str(e)}
    
    
    

async def get_documents(collection_name: str, query: dict):
    try:
        if "_id" in query:
            query["_id"] = ObjectId(query["_id"])

        collection = db[collection_name]
        cursor = collection.find(query)  # Synchronous

        results = []
        for doc in cursor:  # regular for loop
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        if not results:
            return {
                "code": 404,
                "message": "No documents matched",
                "data": [],
                "success": False
            }

        return {
            "code": 200,
            "message": "Documents found",
            "data": results,
            "success": True
        }

    except Exception as e:
        print(f"An exception occurred: {e}")
        return {
            "code": 500,
            "message": "Internal Server Error",
            "data": [],
            "success": False
        }
