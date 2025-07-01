from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain.chat_models import init_chat_model
from langchain_core.messages import SystemMessage, HumanMessage

import os
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import hashlib

# Import the system prompt from prompts module
from src.prompts import SYSTEM_PROMPT

# Initialize LangSmith tracing if configured
from src.langsmith_debug import LANGSMITH_API_KEY,LANGSMITH_ENDPOINT,LANGSMITH_PROJECT,LANGSMITH_TRACING

# Load environment variables from .env file
load_dotenv()

# setting up Firestore for caching
from firebase_admin import firestore, initialize_app
initialize_app()
db = firestore.client()

class AgentState(TypedDict):
    messages: list

class AI_Agent:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = init_chat_model(os.getenv("LLM_MODEL"), temperature=0.1)
        self.system_prompt = SYSTEM_PROMPT


    def get_response(self, user_message: str) -> str:
        # Use a hash of the user message as the cache key
        cache_key = f"ai_response:{hashlib.sha256(user_message.encode()).hexdigest()}"
        
        # Try to get from cache first
        try:
            cached = db.collection("devops-agent-cache").document(cache_key).get()
            if cached.exists:
                data = cached.to_dict()
                expires = data.get("expires")
                if expires and expires > datetime.now(timezone.utc):
                    return data.get("response")
                else:
                    # Optionally delete expired cache
                    try:
                        db.collection("devops-agent-cache").document(cache_key).delete()
                    except Exception as e:
                        print(f"Warning: Failed to delete expired cache: {e}")
        except Exception as e:
            print(f"Warning: Failed to read from cache: {e}")
        
        # Compose messages for the LLM
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=user_message)
        ]
        
        # Get response from LLM
        response = self.llm(messages)
        response_content = response.content
        
        # Try to store the response in Firestore cache (non-blocking)
        try:
            db.collection("devops-agent-cache").document(cache_key).set({
                "response": response_content,
                "expires": datetime.now(timezone.utc) + timedelta(days=1)
            })
        except Exception as e:
            print(f"Warning: Failed to cache response: {e}")
            # Don't fail the entire request if caching fails
        
        return response_content

def main():

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("GOOGLE_API_KEY not found in environment variables.")
        return
    

    agent = AI_Agent(api_key)
    user_input = input("Ask your DevOps Engineer question: ")
    print(agent.get_response(user_input))

if __name__ == "__main__":
    main()