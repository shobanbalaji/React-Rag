from app.db.mongo import db
from app.models.auth import UserCreate, UserInDB
from passlib.context import CryptContext
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
users_collection = db["users"]

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_user(user: UserCreate):
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise ValueError("User already exists")

    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]

    result = users_collection.insert_one(user_dict)
    return str(result.inserted_id)
