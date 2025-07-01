// DevOps AI Agent - Frontend JavaScript

class DevOpsAgent {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        
        // Set up dynamic base path for API calls
        this.basePath = this.getBasePath();
        
        this.initEventListeners();
        this.setupQuestionCards();
    }

    getBasePath() {
        // Use the base path stored by the HTML script, or calculate it
        if (window.AI_AGENT_BASE_PATH) {
            return window.AI_AGENT_BASE_PATH;
        }
        
        // Fallback: Get the current path and ensure it ends with /
        const currentPath = window.location.pathname;
        return currentPath.endsWith('/') ? currentPath : currentPath + '/';
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
            // Call the DevOps API
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
            this.addMessage('Sorry, I\'m having trouble connecting to the server. Please try again later.', 'bot');
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
        // Use dynamic base path for API calls
        const apiPath = `${this.basePath}api/chat`;
        
        console.log('Making POST request to:', apiPath);
        console.log('Request body:', JSON.stringify({ message: message }));
        console.log('Base path:', this.basePath);
        console.log('Current URL:', window.location.href);
        console.log('Expected Cloud Run URL would be: https://devops-agent-948325778469.northamerica-northeast2.run.app/api/chat');
        
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        if (!response.ok) {
            try {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
            } catch (e) {
                console.log('Could not read error response body');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response || 'Sorry, I couldn\'t process your request.';
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