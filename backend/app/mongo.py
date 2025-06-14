from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Read the MongoDB URI from .env
MONGO_URI = "mongodb+srv://projectsshoban:shbnmllx@cluster0.vo17w9c.mongodb.net/"

# Create MongoDB client
client = MongoClient(MONGO_URI)

def get_db():
    return client["Rag"]  # DB name seen in your screenshot
