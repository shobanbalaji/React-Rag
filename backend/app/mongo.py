from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get Mongo URI from env
MONGO_URI = os.getenv("mongo_cred", "mongodb://localhost:27017")

# Initialize MongoDB client
client = MongoClient(MONGO_URI)

# Pick the database
db = client["rag_db"]  # Change the name as needed
