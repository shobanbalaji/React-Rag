from fastapi import FastAPI
from pydantic import BaseModel
from app.routes.users.user_routes import router as user_routes
from app.routes.authentication.auth_routes import router as auth_routes
from app.routes.chat.chat_routes import router as chat_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins =["https://storm-backend.onrender.com", "https://stormai.web.app", "https://stormai.firebaseapp.com","http://localhost:5173"]

# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    # allow_origins=origins,  # Or specify domains: ["http://localhost:3000"]
    allow_origins=["*"],  # Or specify domains: ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


@app.get("/")
async def root():
    return {"message": "API is running!"}


app.include_router(user_routes, prefix="/api/users", tags=["users"])
app.include_router(auth_routes, prefix="/api/authentication", tags=["authentication"])
app.include_router(chat_routes, prefix="/api/chat", tags=["chat"])
