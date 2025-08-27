from fastapi import APIRouter
from app.controller.users.user_controller import get_current_user, create_user
from pydantic import BaseModel
router = APIRouter()

@router.get("/getAllUsers")
def getCurrentUserData():
    return get_current_user()


# Define the expected body
class UserPayload(BaseModel):
    email: str
    userName: str
    password:str


@router.post("/createUser")
async def getCurrentUserData(payload: UserPayload):
    return await create_user(payload)