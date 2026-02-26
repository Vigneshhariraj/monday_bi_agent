from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from agent import process_query

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    mondayApiKey: Optional[str] = None
    geminiApiKey: Optional[str] = None
    dealsBoardId: Optional[str] = None
    workOrdersBoardId: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

@app.post("/query")
def query_agent(request: QueryRequest):
    config = {
        "mondayApiKey": request.mondayApiKey,
        "geminiApiKey": request.geminiApiKey,
        "dealsBoardId": request.dealsBoardId,
        "workOrdersBoardId": request.workOrdersBoardId
    }
    result = process_query(request.question, config, history=request.history)
    return result