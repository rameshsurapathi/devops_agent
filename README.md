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

### ⚡ High-Performance Backend
- **FastAPI**: Async Python web framework for high performance
- **Redis Caching**: Response caching for improved speed
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Comprehensive error management
- **LangSmith Integration**: Advanced tracing and debugging

### 🔧 DevOps-First Architecture
- **Containerizable**: Docker-ready configuration
- **Environment Management**: Secure environment variable handling
- **Monitoring Ready**: Built-in health checks and logging
- **Scalable**: Designed for production deployment

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
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Modern Python project configuration
├── start.sh                # Quick start script
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+** installed on your system
- **Google AI API Key** (for Gemini integration)
- **Redis** (optional, for caching)

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

3. **Configure environment variables**
   ```bash
   # Copy example environment file
   cp src/.env.example src/.env
   
   # Edit with your API keys
   nano src/.env
   ```

4. **Start the application**
   ```bash
   # Using the start script
   chmod +x start.sh
   ./start.sh
   
   # Or manually
   python main.py
   ```

5. **Access the application**
   - Open your browser to `http://localhost:8000`
   - Start asking DevOps questions!

## ⚙️ Configuration

### Environment Variables

Create a `src/.env` file with the following variables:

```env
# Required: Google AI API Key
GOOGLE_API_KEY=your_google_api_key_here

# LLM Model Configuration
LLM_MODEL=gemini-1.5-flash

# LangSmith Configuration (Optional)
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_PROJECT=devops-agent
LANGSMITH_TRACING=true

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Application Settings
PORT=8000
DEBUG=false
```

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

response = requests.post(
    "http://localhost:8000/api/chat",
    json={"message": "How do I set up GitOps with ArgoCD?"}
)

print(response.json()["response"])
```

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

The application implements intelligent caching using Redis:

```python
# Cache responses for 24 hours
cache_key = f"ai_response:{hashlib.sha256(user_message.encode()).hexdigest()}"
redis_client.setex(cache_key, 86400, response.content)
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

CMD ["python", "main.py"]
```

### Production Deployment

```bash
# Using Gunicorn for production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000

# Or using Uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Setup

```bash
# Production environment variables
export GOOGLE_API_KEY="your-production-key"
export REDIS_URL="redis://your-redis-instance:6379"
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

### Version 0.1.0 (Current)
- ✅ Initial release
- ✅ FastAPI backend with AI integration
- ✅ Modern web interface
- ✅ Redis caching
- ✅ Rate limiting
- ✅ LangSmith integration
- ✅ Comprehensive DevOps knowledge base

### Planned Features
- 🔄 Multi-model support (OpenAI, Anthropic)
- 🔄 User authentication and sessions
- 🔄 Conversation history
- 🔄 File upload for configuration analysis
- 🔄 Integration with DevOps tools (GitHub, Jenkins)
- 🔄 Advanced analytics and reporting

## 🆘 Troubleshooting

### Common Issues

**1. Google API Key Error**
```
Solution: Ensure GOOGLE_API_KEY is set in src/.env file
```

**2. Redis Connection Error**
```
Solution: Install and start Redis, or disable caching in ai_agent.py
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

```python
# In main.py
uvicorn.run(app, host="0.0.0.0", port=port, debug=True)
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
- **Redis**: For efficient caching
- **DevOps Community**: For inspiration and best practices

---

**Built with ❤️ for the DevOps Community**

*Transform your DevOps journey with AI-powered expertise!*