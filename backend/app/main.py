from fastapi import FastAPI
from pydantic import BaseModel
from app.routes.users import user_routes
app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "API is running!"}


app.include_router(user_routes.router, prefix="/api/users", tags=["users"])


@app.post("/query")
async def query_endpoint(request: QueryRequest):
    user_query = request.query
    # For now, just echo the query back with a dummy answer
    return {
        "query": user_query,
        "answer": f"You asked: '{user_query}'. This is a dummy response."
    }
