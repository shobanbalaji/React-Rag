from fastapi import APIRouter
from app.controller.users.user_controller import get_current_user, create_user
from pydantic import BaseModel
from app.models.user.user_model import createUserModel
router = APIRouter()

@router.get("/getAllUsers")
async def getCurrentUserData():
    return get_current_user()


# Define the expected body
class UserPayload(BaseModel):
    email: str
    userName: str
    password:str


@router.post("/createUser")
async def createUser(payload: createUserModel):
    return await create_user(payload)