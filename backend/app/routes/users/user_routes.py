from fastapi import APIRouter
from app.controller.users.user_controller import get_current_user
router = APIRouter()

@router.get("/getAllUsers")
def getCurrentUserData():
    return get_current_user()