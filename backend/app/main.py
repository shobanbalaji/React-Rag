from fastapi import FastAPI
from pydantic import BaseModel
from app.routes.users import user_routes
from app.routes.authentication.auth_routes import router as auth_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify domains: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "API is running!"}


app.include_router(user_routes.router, prefix="/api/users", tags=["users"])
app.include_router(auth_routes, prefix="/api/authentication", tags=["authentication"])


@app.post("/query")
async def query_endpoint(request: QueryRequest):
    user_query = request.query
    # For now, just echo the query back with a dummy answer
    return {
        "query": user_query,
        "answer": f"You asked: '{user_query}'. This is a dummy response."
    }
