
# Dockerfile

# Base image
# Use a lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

#  Copy requirements file
# This file should contain all the dependencies for your application
COPY requirements.txt .

# Install dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the application port
EXPOSE 8080

# Command to run the application

CMD ["uvicorn","app:app", "--host","0.0.0.0","-port","8080"]


