from fastapi import APIRouter, HTTPException
from app.models.authentication.auth import createUser

router = APIRouter()

@router.post("/signup")
async def signup(user:createUser):
    try:
        user_id = createUser(user)