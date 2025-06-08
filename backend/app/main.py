from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "API is running!"}

@app.post("/query")
async def query_endpoint(request: QueryRequest):
    user_query = request.query
    # For now, just echo the query back with a dummy answer
    return {
        "query": user_query,
        "answer": f"You asked: '{user_query}'. This is a dummy response."
    }
