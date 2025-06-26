
# Dockerfile for DevOps AI Agent
# Recommended image name: gcr.io/YOUR_PROJECT_ID/devops-ai-agent:latest

# Base image - Use Python 3.13 to match your requirements
FROM python:3.13-slim

# Set metadata labels
LABEL version="1.0"
LABEL description="DevOps AI Agent - Intelligent DevOps Assistant"
LABEL org.opencontainers.image.title="DevOps AI Agent"
LABEL org.opencontainers.image.description="AI-powered DevOps assistant for CI/CD, IaC, and automation guidance"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first (for better Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the application port (Google Cloud Run will set PORT env var)
EXPOSE 8080

# Command to run the application
# Use the PORT environment variable provided by Google Cloud Run
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8080}"]


