from fastapi import APIRouter, HTTPException
from app.models.authentication.auth import verifyUser
from app.controller.authentication.auth import authenticateUser 

router = APIRouter()

@router.post("/authUser")
async def auth_user(user: verifyUser):
    try:
        payload = user.dict()
        return await authenticateUser(payload)
    except Exception as e:
        print(f'Exception occurred: {e}')
        raise HTTPException(status_code=500, detail="Internal server error")
