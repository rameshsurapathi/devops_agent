from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import time
from collections import defaultdict
import os
from src.ai_agent import AI_Agent

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up Jinja2 templates and static files
templates = Jinja2Templates(directory="templates")

# Serve static files from the "static" directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Simple in-memory rate limiter: {ip: [timestamps]}
rate_limit_window = 60  # seconds
rate_limit_count = 5
rate_limit_data = defaultdict(list)

# Define the request model for chat messages
class ChatRequest(BaseModel):
    message: str
    user_id: str = None  # Optional user ID for chat history

class ChatHistoryRequest(BaseModel):
    user_id: str
    limit: int = 10  # Default to 10 conversations

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/chat")
async def chat_endpoint(request: Request, chat: ChatRequest):
    client_ip = request.client.host
    now = time.time()
    timestamps = rate_limit_data[client_ip]
    # Remove timestamps outside the window
    rate_limit_data[client_ip] = [t for t in timestamps if now - t < rate_limit_window]
    if len(rate_limit_data[client_ip]) >= rate_limit_count:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait.")
    rate_limit_data[client_ip].append(now)

    try:
        # Use AI agent to generate response
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API configuration error. Please check server configuration.")
        
        agent = AI_Agent(api_key)
        response = agent.get_response(chat.message, chat.user_id)
        
        # Handle large responses more gracefully
        json_response = JSONResponse({
            "response": response
        })
        
        # Add headers to help with large responses
        json_response.headers["Cache-Control"] = "no-cache"
        json_response.headers["Connection"] = "keep-alive"
        
        return json_response
    except Exception as e:
        error_msg = str(e)
        print(f"Error in chat endpoint: {error_msg}")
        
        # Don't expose internal errors to client in production
        if "API" in error_msg or "key" in error_msg.lower():
            detail = "API configuration error. Please check server configuration."
        elif "rate limit" in error_msg.lower():
            detail = "Rate limit exceeded. Please try again later."
        else:
            detail = "Internal server error. Please try again later."
            
        raise HTTPException(status_code=500, detail=detail)

@app.post("/api/chat-history")
async def get_chat_history(request: Request, chat_history: ChatHistoryRequest):
    """Get user's chat history"""
    try:
        print(f"Chat history request - User ID: {chat_history.user_id}, Limit: {chat_history.limit}")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("GOOGLE_API_KEY not found")
            raise HTTPException(status_code=500, detail="API configuration error")
        
        agent = AI_Agent(api_key)
        history = agent.get_user_chat_history(chat_history.user_id, chat_history.limit)
        
        print(f"Retrieved {len(history)} conversations for user {chat_history.user_id}")
        
        return JSONResponse({
            "history": history
        })
    except Exception as e:
        print(f"Error in chat history endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to retrieve chat history: {str(e)}")

@app.delete("/api/chat-history")
async def clear_chat_history(request: Request, chat_history: ChatHistoryRequest):
    """Clear user's chat history"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API configuration error")
        
        agent = AI_Agent(api_key)
        # Clear history by deleting the document
        from firebase_admin import firestore
        db = firestore.client()
        db.collection("chat-history").document(chat_history.user_id).delete()
        
        return JSONResponse({
            "message": "Chat history cleared successfully"
        })
    except Exception as e:
        print(f"Error in clear chat history endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to clear chat history")

