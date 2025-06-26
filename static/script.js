// DevOps AI Agent - Frontend JavaScript

class DevOpsAgent {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.initEventListeners();
        this.setupQuestionCards();
    }

    initEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Auto-resize chat input
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = this.chatInput.scrollHeight + 'px';
        });
    }

    setupQuestionCards() {
        const questionItems = document.querySelectorAll('.question-item');
        questionItems.forEach(item => {
            item.addEventListener('click', () => {
                const questionText = item.querySelector('p').textContent;
                this.chatInput.value = questionText;
                this.chatInput.focus();
            });
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Simulate API call - replace with actual backend endpoint
            const response = await this.callDevOpsAPI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
            // Ensure the full response is visible
            setTimeout(() => this.ensureMessageVisible(), 300);
        } catch (error) {
            console.error('Error calling DevOps API:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        // Handle markdown-like formatting
        const formattedContent = this.formatMessage(content);
        contentDiv.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            this.scrollToBottom();
            // Double check scroll after a brief delay to handle any layout shifts
            setTimeout(() => this.scrollToBottom(), 200);
        });
    }

    formatMessage(content) {
        // Basic markdown-like formatting
        let formatted = content
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        return `<p>${formatted}</p>`;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-message');
        typingDiv.id = 'typing-indicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(typingDiv);
        requestAnimationFrame(() => this.scrollToBottom());
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async callDevOpsAPI(message) {
        try {
            // Check if we're running with a backend server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response || 'Sorry, I couldn\'t process your request.';
        } catch (error) {
            console.warn('Backend not available, using mock responses:', error.message);
            // Simulate API delay for better UX
            await this.delay(1000 + Math.random() * 2000);
            // Fallback to mock response if API fails or no backend
            return this.generateMockResponse(message);
        }
    }

    generateMockResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('jenkins') || lowerMessage.includes('ci/cd') || lowerMessage.includes('pipeline')) {
            return `Great question about CI/CD! Here's a comprehensive approach:

**Jenkins Pipeline Setup:**
1. Create a \`Jenkinsfile\` in your repository root
2. Configure stages: Build → Test → Security Scan → Deploy
3. Use Docker for consistent environments
4. Set up parallel testing for faster feedback

**Key Best Practices:**
- Use declarative pipelines for better maintainability
- Implement proper error handling and notifications
- Set up pipeline as code for version control
- Configure automated rollback mechanisms

Would you like me to elaborate on any specific aspect of the CI/CD pipeline?`;
        }
        
        if (lowerMessage.includes('terraform') || lowerMessage.includes('infrastructure') || lowerMessage.includes('iac')) {
            return `Excellent! Infrastructure as Code with Terraform is crucial for modern DevOps:

**Terraform Best Practices:**
1. **Module Structure**: Organize code into reusable modules
2. **State Management**: Use remote state with S3 + DynamoDB
3. **Environment Separation**: Use workspaces or separate state files
4. **Security**: Store sensitive data in vault/secrets manager

**Multi-Cloud Strategy:**
- Use provider-agnostic modules where possible
- Implement consistent tagging and naming conventions
- Set up cross-cloud networking and security policies
- Monitor costs across all cloud providers

Need help with a specific Terraform configuration or multi-cloud setup?`;
        }
        
        if (lowerMessage.includes('kubernetes') || lowerMessage.includes('k8s') || lowerMessage.includes('container')) {
            return `Kubernetes deployment strategies are essential for scalable applications:

**Container Orchestration Setup:**
1. **Cluster Design**: Multi-node setup with proper resource allocation
2. **Networking**: Implement service mesh (Istio/Linkerd) for advanced traffic management
3. **Storage**: Configure persistent volumes and storage classes
4. **Security**: RBAC, network policies, and pod security standards

**Deployment Patterns:**
- **Blue-Green**: Zero-downtime deployments
- **Canary**: Gradual rollout with traffic splitting
- **Rolling Updates**: Default Kubernetes strategy

**Monitoring Stack:**
- Prometheus + Grafana for metrics
- ELK Stack for centralized logging
- Jaeger for distributed tracing

What specific Kubernetes challenge are you facing?`;
        }
        
        if (lowerMessage.includes('docker') || lowerMessage.includes('containerization')) {
            return `Docker containerization is the foundation of modern application deployment:

**Docker Best Practices:**
1. **Multi-stage builds** to reduce image size
2. **Security scanning** with tools like Trivy or Snyk
3. **Proper layer caching** for faster builds
4. **Non-root user** execution for security

**Container Registry Strategy:**
- Use private registries for production images
- Implement image signing and vulnerability scanning
- Set up automated cleanup policies
- Configure content trust for image verification

**Sample Dockerfile optimization:**
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/node_modules ./node_modules
USER nextjs
\`\`\`

Would you like help optimizing a specific Dockerfile?`;
        }
        
        if (lowerMessage.includes('automation') || lowerMessage.includes('security') || lowerMessage.includes('monitoring')) {
            return `Automation and security are critical for robust DevOps practices:

**Security Automation:**
1. **SAST/DAST**: Integrate security scanning in pipelines
2. **Compliance**: Automated policy enforcement with OPA
3. **Secrets Management**: Vault, AWS Secrets Manager, or Azure Key Vault
4. **Vulnerability Management**: Regular scanning and patch automation

**Monitoring & Alerting:**
- **Infrastructure**: Prometheus, CloudWatch, Azure Monitor
- **Applications**: APM tools like Datadog, New Relic
- **Logs**: Centralized logging with correlation IDs
- **Synthetic Monitoring**: Proactive health checks

**Backup & DR Automation:**
- Automated database backups with point-in-time recovery
- Cross-region replication for disaster recovery
- Regular DR testing and validation
- Infrastructure backup using Terraform state

What specific automation challenge would you like to address?`;
        }
        
        // Default response
        return `I'm here to help with your DevOps questions! I specialize in:

🔧 **CI/CD Pipelines** - Jenkins, GitHub Actions, GitLab CI
🏗️ **Infrastructure as Code** - Terraform, CloudFormation, Pulumi  
🐳 **Containerization** - Docker, Kubernetes, Container Registries
☁️ **Cloud Platforms** - AWS, Azure, GCP best practices
🔒 **Security & Compliance** - DevSecOps, policy automation
📊 **Monitoring & Observability** - Prometheus, Grafana, ELK Stack
🚀 **Automation** - Ansible, Puppet, Chef configuration management

Please feel free to ask about any specific DevOps challenge you're facing. I can provide detailed guidance, code examples, and best practices!`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    scrollToBottom() {
        // Since chat messages container no longer has overflow, just scroll to the latest message
        const lastMessage = this.chatMessages.lastElementChild;
        if (lastMessage) {
            lastMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }
    }

    // Enhanced scroll method to ensure message visibility
    ensureMessageVisible() {
        const lastMessage = this.chatMessages.lastElementChild;
        if (lastMessage) {
            // Scroll the page to show the complete message
            setTimeout(() => {
                lastMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end',
                    inline: 'nearest'
                });
            }, 150);
        }
    }
}

// Utility functions for enhanced interactivity
function highlightCode() {
    // Add syntax highlighting to code blocks if needed
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(block => {
        block.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent);
            showToast('Code copied to clipboard!');
        });
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the DevOps Agent when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DevOpsAgent();
    highlightCode();
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';