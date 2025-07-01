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

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/chat")
async def chat_get_endpoint():
    return JSONResponse({
        "error": "This endpoint only accepts POST requests",
        "message": "Please send a POST request with a JSON body containing 'message' field"
    })

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
        print(f"Processing request from {client_ip}: {chat.message[:50]}...")
        
        # Use AI agent to generate response
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Error: GOOGLE_API_KEY not found")
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not found in environment variables.")
        
        print("Creating AI agent...")
        agent = AI_Agent(api_key)
        
        print("Calling get_response...")
        response = agent.get_response(chat.message)
        
        print(f"Response generated successfully: {len(response)} characters")
        
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
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {error_msg}")

