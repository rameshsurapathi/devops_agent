# 🚀 DevOps AI Agent

An intelligent DevOps assistant that provides expert guidance on CI/CD pipelines, Infrastructure as Code, containerization, and automation. Built with FastAPI, LangChain, and modern web technologies.

![DevOps AI Agent](https://img.shields.io/badge/DevOps-AI%20Agent-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![LangChain](https://img.shields.io/badge/LangChain-Latest-purple)

## 🎯 Overview

The DevOps AI Agent is a comprehensive solution that combines the power of Large Language Models with deep DevOps expertise to help developers, engineers, and organizations implement best practices in:

- **CI/CD Pipelines** - Jenkins, GitHub Actions, GitLab CI, Azure DevOps
- **Infrastructure as Code** - Terraform, CloudFormation, Pulumi, Ansible
- **Container Orchestration** - Kubernetes, Docker, Container Registries
- **Cloud Platforms** - AWS, Azure, GCP, Multi-cloud strategies
- **Security & Compliance** - DevSecOps, Policy automation, Vulnerability management
- **Monitoring & Observability** - Prometheus, Grafana, ELK Stack, APM tools

## ✨ Key Features

### 🧠 Intelligent AI Assistant
- **Expert Knowledge**: Principal DevOps Engineer with 20+ years of experience
- **Context-Aware**: Understands your specific environment and constraints
- **Best Practices**: Provides industry-standard solutions and recommendations
- **Code Examples**: Generates practical, production-ready configurations

### 🎨 Modern Web Interface
- **Beautiful UI**: Mint/teal themed responsive design
- **Interactive Cards**: Pre-built question categories for quick access
- **Real-time Chat**: Smooth messaging with typing indicators
- **Auto-scrolling**: Automatic scroll to show complete responses
- **Mobile-Friendly**: Responsive design for all device types
- **Chat History Management**: View, manage, and navigate conversation history
- **Collapsible Responses**: Expandable AI responses in history view for better readability
- **PDF Export**: Save individual bot responses as formatted PDF documents
- **New Chat Sessions**: Start fresh conversations without losing history
- **Persistent User Sessions**: Browser-based user identification for personalized experience

### ⚡ High-Performance Backend
- **FastAPI**: Async Python web framework for high performance
- **Firestore Caching**: Cloud-based NoSQL database for response caching
- **Chat History Storage**: Persistent conversation storage with automatic expiration
- **User-Specific Sessions**: Individual user tracking without authentication
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Comprehensive error management
- **LangSmith Integration**: Advanced tracing and debugging
- **JSON Serialization**: Proper datetime handling for API responses

### 🔧 DevOps-First Architecture
- **Containerizable**: Docker-ready configuration
- **Environment Management**: Secure environment variable handling
- **Monitoring Ready**: Built-in health checks and logging
- **Scalable**: Designed for production deployment

### 💬 Advanced Chat Features
- **Persistent Chat History**: Conversations stored securely in Firestore
- **User Session Management**: Browser fingerprinting for user identification
- **Smart History Loading**: Load recent conversations on page refresh
- **Collapsible Chat History**: Expandable responses for efficient browsing
- **PDF Export**: Professional PDF generation for individual responses
- **Multiple Chat Controls**:
  - **New Chat**: Start fresh without deleting history
  - **View History**: Browse all past conversations in modal
  - **Delete History**: Permanently remove all conversation data
- **Context-Aware Responses**: AI remembers recent conversation context
- **Auto-Expiration**: Chat history automatically expires after 7 days
- **Optimized Storage**: Conversation limits (50 per user) for performance

## 🏗️ Project Structure

```
devops_agent/
├── 📁 src/                    # Core application logic
│   ├── ai_agent.py           # AI agent implementation
│   ├── prompts.py            # System prompts and instructions
│   ├── langsmith_debug.py    # LangSmith configuration
│   └── .env                  # Environment variables
├── 📁 templates/             # HTML templates
│   └── index.html           # Main web interface
├── 📁 static/               # Static assets
│   ├── styles.css           # CSS styling
│   └── script.js            # Frontend JavaScript
├── 📁 __pycache__/          # Python bytecode cache
├── app.py                   # FastAPI application
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Modern Python project configuration
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+** installed on your system
- **Google AI API Key** (for Gemini integration)
- **Firebase Project** (for Firestore caching and chat history)
- **Firebase Service Account** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devops_agent
   ```

2. **Set up environment**
   ```bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Set up Firebase Project**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database in the project
   - Create a Service Account:
     - Go to Project Settings → Service Accounts
     - Click "Generate new private key"
     - Download the JSON key file
   - Extract the required credentials from the JSON file

4. **Configure environment variables**
   ```bash
   # Create environment file
   touch src/.env
   
   # Edit with your API keys and Firebase credentials
   nano src/.env
   ```
   
   See the [Environment Variables](#environment-variables) section below for required configuration.

5. **Start the application**
   ```bash
   # Start the FastAPI server with uvicorn
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Access the application**
   - Open your browser to `http://localhost:8000`
   - Start asking DevOps questions!
   - Your chat history will be automatically saved and restored

## ⚙️ Configuration

### Environment Variables

Create a `src/.env` file with the following variables:

```env
# Required: Google AI API Key
GOOGLE_API_KEY=your_google_api_key_here

# LLM Model Configuration
LLM_MODEL=gemini-1.5-flash

# Firebase Configuration (Required for chat history and caching)
# Get these values from your Firebase Service Account JSON file
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# LangSmith Configuration (Optional - for debugging)
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_PROJECT=devops-agent
LANGSMITH_TRACING=true

# Application Settings
PORT=8000
DEBUG=false
```

**Note**: Without proper Firebase configuration, the chat history and caching features will not work. The application will still function for single conversations but won't persist data.

### API Configuration

The application supports multiple LLM providers through LangChain:

- **Google Gemini** (default): `gemini-1.5-flash`, `gemini-1.5-pro`
- **OpenAI**: `gpt-4`, `gpt-3.5-turbo`
- **Anthropic**: `claude-3-sonnet`, `claude-3-haiku`
- **Local Models**: Ollama, LM Studio

## 🎯 Usage Examples

### Sample DevOps Questions

**CI/CD Pipeline Design:**
```
"Design a complete CI/CD pipeline using Jenkins, Docker, and Kubernetes for a microservices application"
```

**Infrastructure as Code:**
```
"Build Infrastructure as Code using Terraform for multi-cloud deployment across AWS, Azure, and GCP"
```

**Container Orchestration:**
```
"Design a scalable Kubernetes cluster with monitoring, logging, and security best practices"
```

**Security Automation:**
```
"Automate security scanning and compliance checks in CI/CD pipelines using SonarQube and Trivy"
```

### API Usage

You can also interact with the agent programmatically:

```python
import requests

# Send a chat message
response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "message": "How do I set up GitOps with ArgoCD?",
        "user_id": "your_user_id"  # Optional for history tracking
    }
)

print(response.json()["response"])

# Get chat history
history_response = requests.post(
    "http://localhost:8000/api/chat-history",
    json={
        "user_id": "your_user_id",
        "limit": 10  # Number of conversations to retrieve
    }
)

print(history_response.json()["history"])

# Clear chat history
clear_response = requests.delete(
    "http://localhost:8000/api/chat-history",
    json={"user_id": "your_user_id"}
)
```

### Chat History Management

The application provides comprehensive chat history features:

1. **Automatic History Loading**: Recent conversations load when you visit the page
2. **View All History**: Click "View History" to see all past conversations
3. **Collapsible Responses**: Click "Show Response" to expand AI answers
4. **PDF Export**: Save any bot response as a formatted PDF
5. **New Chat Sessions**: Start fresh while preserving history
6. **History Cleanup**: Delete all history when needed

## 🔧 Technical Architecture

### Backend Components

1. **FastAPI Application** (`app.py`)
   - RESTful API endpoints
   - CORS middleware for frontend integration
   - Rate limiting and error handling
   - Static file serving

2. **AI Agent** (`src/ai_agent.py`)
   - LangChain integration
   - Google Gemini model interface
   - Redis caching for performance
   - Structured response generation

3. **Prompt Engineering** (`src/prompts.py`)
   - Comprehensive system prompts
   - DevOps expertise modeling
   - Context-aware response framework

### Frontend Components

1. **HTML Interface** (`templates/index.html`)
   - Semantic HTML structure
   - Responsive design
   - Interactive question cards
   - Chat interface

2. **CSS Styling** (`static/styles.css`)
   - Modern mint/teal color scheme
   - Responsive grid layouts
   - Smooth animations
   - Mobile-first design

3. **JavaScript Logic** (`static/script.js`)
   - Real-time chat functionality
   - API integration
   - Auto-scrolling behavior
   - Interactive elements

## 🔍 Advanced Features

### Response Caching

The application implements intelligent caching using Google Firestore:

```python
# Cache responses in Firestore with TTL
cache_ref = db.collection('ai_responses').document(cache_key)
cache_ref.set({
    'response': response.content,
    'timestamp': time.time(),
    'ttl': 86400  # 24 hours
})
```

### Rate Limiting

Built-in protection against API abuse:

```python
# 5 requests per minute per IP
rate_limit_window = 60  # seconds
rate_limit_count = 5
```

### Error Handling

Comprehensive error management with fallback responses:

```python
try:
    response = agent.get_response(chat.message)
    return JSONResponse({"response": response})
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.13-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Deployment

```bash
# Start the application with uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4

# For production with more options
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4 --access-log --log-level info
```

### Environment Setup

```bash
# Production environment variables
export GOOGLE_API_KEY="your-production-key"
export FIREBASE_PROJECT_ID="your-firebase-project"
export PORT=8000
export DEBUG=false
```

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/

# Run with coverage
pytest --cov=src tests/
```

### Manual Testing

1. **Health Check**: `GET /health`
2. **Chat Endpoint**: `POST /api/chat`
3. **Frontend**: Open `http://localhost:8000`

## 📊 Monitoring & Observability

### Health Checks

The application includes built-in health monitoring:

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}
```

### LangSmith Integration

Advanced tracing and debugging with LangSmith:

```python
from langsmith import trace

@trace
def get_response(self, user_message: str) -> str:
    # Automatic tracing of AI interactions
    pass
```

### Logging

Structured logging for production monitoring:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## 🔐 Security Considerations

### API Security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Pydantic models for request validation
- **Environment Variables**: Secure handling of sensitive data
- **CORS Configuration**: Controlled cross-origin access

### Production Security
- Use HTTPS in production
- Implement API authentication
- Regular security updates
- Monitor for vulnerabilities

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install development dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Make your changes**
5. **Run tests**
   ```bash
   pytest tests/
   ```

6. **Submit a pull request**

### Code Style

- Follow PEP 8 for Python code
- Use type hints where appropriate
- Write descriptive commit messages
- Add tests for new features

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release with comprehensive features
- ✅ FastAPI backend with AI integration
- ✅ Modern responsive web interface
- ✅ Firestore caching and chat history storage
- ✅ User session management via browser fingerprinting
- ✅ Rate limiting and comprehensive error handling
- ✅ LangSmith integration for debugging
- ✅ Comprehensive DevOps knowledge base
- ✅ **Chat History Features**:
  - Persistent conversation storage
  - Collapsible response view in history modal
  - Auto-loading recent conversations
  - Context-aware responses using chat history
- ✅ **PDF Export**: Professional PDF generation for bot responses
- ✅ **Multiple Chat Controls**: New Chat, View History, Delete History
- ✅ **Advanced UI**: Responsive design with smooth animations

### Planned Features
- 🔄 Multi-model support (OpenAI, Anthropic)
- 🔄 User authentication and account management
- 🔄 File upload for configuration analysis
- 🔄 Integration with DevOps tools (GitHub, Jenkins)
- 🔄 Advanced analytics and reporting
- 🔄 Export conversations to multiple formats
- 🔄 Search functionality within chat history

## 🆘 Troubleshooting

### Common Issues

**1. Google API Key Error**
```
Solution: Ensure GOOGLE_API_KEY is set in src/.env file
```

**2. Firestore Connection Error**
```
Solution: Ensure Firebase credentials are properly configured in src/.env file
```

**3. Port Already in Use**
```
Solution: Change PORT in environment variables or stop conflicting service
```

**4. Frontend Not Loading CSS**
```
Solution: Ensure static files are served correctly by FastAPI
```

### Debug Mode

Enable debug mode for detailed error messages:

```bash
# Start with debug and reload enabled
uvicorn app:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/devops-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/devops-agent/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/devops-agent/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LangChain**: For the powerful AI framework
- **FastAPI**: For the modern web framework
- **Google AI**: For the Gemini model API
- **Google Firestore**: For efficient cloud-based caching
- **DevOps Community**: For inspiration and best practices

---

**Built with ❤️ for the DevOps Community**

*Transform your DevOps journey with AI-powered expertise!*