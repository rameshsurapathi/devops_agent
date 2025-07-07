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
try:
    from firebase_admin import firestore, initialize_app
    # Initialize Firebase Admin SDK
    initialize_app()
    # Initialize Firestore client
    db = firestore.client()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

class AgentState(TypedDict):
    messages: list

class AI_Agent:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = init_chat_model(os.getenv("LLM_MODEL"), temperature=0.1)
        self.system_prompt = SYSTEM_PROMPT


    def get_response(self, user_message: str, user_id: str = None) -> str:
        # Use a hash of the user message as the cache key (for global caching)
        cache_key = f"ai_response:{hashlib.sha256(user_message.encode()).hexdigest()}"
        
        # Generate user-specific chat history key
        if user_id:
            chat_history_key = f"chat_history:{user_id}"
        
        # Try to get from cache first
        try:
            if db is not None:
                cached = db.collection("devops-agent-cache").document(cache_key).get()
                if cached.exists:
                    data = cached.to_dict()
                    expires = data.get("expires")
                    if expires and expires > datetime.now(timezone.utc):
                        # Still save to chat history even if cached
                        if user_id:
                            self.save_to_chat_history(user_id, user_message, data.get("response"))
                        return data.get("response")
                    else:
                        # Delete expired cache
                        try:
                            db.collection("devops-agent-cache").document(cache_key).delete()
                        except Exception as e:
                            print(f"Warning: Failed to delete expired cache: {e}")
        except Exception as e:
            print(f"Warning: Failed to read from cache: {e}")
        
        # Get recent chat history for context (if user_id provided)
        chat_context = ""
        if user_id:
            chat_context = self.get_chat_history_context(user_id)
        
        # Compose messages for the LLM
        messages = [SystemMessage(content=self.system_prompt)]
        
        # Add chat history context if available
        if chat_context:
            messages.append(HumanMessage(content=f"Previous conversation context:\n{chat_context}\n\nCurrent question: {user_message}"))
        else:
            messages.append(HumanMessage(content=user_message))
        
        # Get response from LLM
        response = self.llm(messages)
        response_content = response.content
        
        # Store response in cache (1 month expiration)
        try:
            if db is not None:
                db.collection("devops-agent-cache").document(cache_key).set({
                    "response": response_content,
                    "expires": datetime.now(timezone.utc) + timedelta(days=30)  # 1 month
                })
        except Exception as e:
            print(f"Warning: Failed to cache response: {e}")
        
        # Save to chat history (if user_id provided)
        if user_id:
            self.save_to_chat_history(user_id, user_message, response_content)
        
        return response_content
    
    def save_to_chat_history(self, user_id: str, user_message: str, bot_response: str):
        """Save chat interaction to user's history"""
        try:
            if db is None:
                print("Warning: Firebase not initialized, skipping chat history save")
                return
                
            chat_ref = db.collection("chat-history").document(user_id)
            chat_data = chat_ref.get()
            
            new_interaction = {
                "timestamp": datetime.now(timezone.utc),
                "user_message": user_message,
                "bot_response": bot_response
            }
            
            if chat_data.exists:
                # Append to existing history
                history = chat_data.to_dict().get("conversations", [])
                history.append(new_interaction)
                
                # Keep only last 50 interactions (to stay within reasonable limits)
                if len(history) > 50:
                    history = history[-50:]
                
                chat_ref.update({
                    "conversations": history,
                    "last_updated": datetime.now(timezone.utc),
                    "expires": datetime.now(timezone.utc) + timedelta(days=7)  # 1 week
                })
            else:
                # Create new history
                chat_ref.set({
                    "conversations": [new_interaction],
                    "created": datetime.now(timezone.utc),
                    "last_updated": datetime.now(timezone.utc),
                    "expires": datetime.now(timezone.utc) + timedelta(days=7)  # 1 week
                })
        except Exception as e:
            print(f"Warning: Failed to save chat history: {e}")
    
    def get_chat_history_context(self, user_id: str) -> str:
        """Get recent chat history for context"""
        try:
            if db is None:
                print("Warning: Firebase not initialized, returning empty context")
                return ""
                
            chat_ref = db.collection("chat-history").document(user_id)
            chat_data = chat_ref.get()
            
            if chat_data.exists:
                data = chat_data.to_dict()
                expires = data.get("expires")
                
                # Check if history is still valid
                if expires and expires > datetime.now(timezone.utc):
                    conversations = data.get("conversations", [])
                    
                    # Get last 5 interactions for context
                    recent_conversations = conversations[-5:] if len(conversations) > 5 else conversations
                    
                    # Format for LLM context
                    context_parts = []
                    for conv in recent_conversations:
                        context_parts.append(f"User: {conv.get('user_message', '')}")
                        # Truncate long responses for context
                        bot_response = conv.get('bot_response', '')[:200]
                        context_parts.append(f"Assistant: {bot_response}...")
                    
                    return "\n".join(context_parts)
                else:
                    # Delete expired history
                    chat_ref.delete()
        except Exception as e:
            print(f"Warning: Failed to get chat history: {e}")
        
        return ""
    
    def get_user_chat_history(self, user_id: str, limit: int = 10) -> list:
        """Get full chat history for frontend display"""
        try:
            if db is None:
                print("Warning: Firebase not initialized, returning empty history")
                return []
                
            chat_ref = db.collection("chat-history").document(user_id)
            chat_data = chat_ref.get()
            
            if chat_data.exists:
                data = chat_data.to_dict()
                expires = data.get("expires")
                
                if expires and expires > datetime.now(timezone.utc):
                    conversations = data.get("conversations", [])
                    
                    # Convert datetime objects to ISO format strings for JSON serialization
                    serializable_conversations = []
                    for conv in conversations:
                        serializable_conv = {
                            "user_message": conv.get("user_message", ""),
                            "bot_response": conv.get("bot_response", ""),
                            "timestamp": conv.get("timestamp").isoformat() if conv.get("timestamp") else datetime.now(timezone.utc).isoformat()
                        }
                        serializable_conversations.append(serializable_conv)
                    
                    # Return only the last 'limit' conversations
                    return serializable_conversations[-limit:] if len(serializable_conversations) > limit else serializable_conversations
                else:
                    # Delete expired history
                    chat_ref.delete()
        except Exception as e:
            print(f"Warning: Failed to get user chat history: {e}")
        
        return []
    

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