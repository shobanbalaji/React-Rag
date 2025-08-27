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


async def get_documents(collection_name: str, query: dict, exclude_fields: list = None):
    try:
        if "_id" in query:
            query["_id"] = ObjectId(query["_id"])

        collection = db[collection_name]

        # Build the projection dict to exclude specified fields
        projection = None
        if exclude_fields:
            projection = {field: 0 for field in exclude_fields}

        cursor = collection.find(query, projection)  # Add projection here

        results = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        if not results:
            return {
                "code": 404,
                "message": "No documents matched",
                "data": [],
                "success": False,
            }

        return {
            "code": 200,
            "message": "Documents found",
            "data": results,
            "success": True,
        }

    except Exception as e:
        print(f"An exception occurred: {e}")
        return {
            "code": 500,
            "message": "Internal Server Error",
            "data": [],
            "success": False,
        }


def clean_object_ids(data):
    if isinstance(data, dict):
        return {key: clean_object_ids(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [clean_object_ids(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data
