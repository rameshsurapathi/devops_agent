// DevOps AI Agent - Frontend JavaScript

class DevOpsAgent {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.userId = this.getUserId();
        
        this.initEventListeners();
        this.setupQuestionCards();
        this.loadChatHistory();
    }

    getUserId() {
        let userId = localStorage.getItem('devops_agent_user_id');
        if (!userId) {
            userId = this.generateBrowserFingerprint() + '_' + Date.now();
            localStorage.setItem('devops_agent_user_id', userId);
        }
        return userId;
    }

    generateBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return btoa(fingerprint).substring(0, 20);
    }

    async loadChatHistory() {
        try {
            const response = await fetch('https://devops-agent-948325778469.northamerica-northeast2.run.app/api/chat-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id: this.userId,
                    limit: 10  // Only request last 10 conversations
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const history = data.history || [];
                
                // Display the conversations (no need to slice since backend limits them)
                const recentHistory = history;
                recentHistory.forEach(conversation => {
                    this.addMessage(conversation.user_message, 'user', false);
                    this.addMessage(conversation.bot_response, 'bot', false);
                });
                
                if (recentHistory.length > 0) {
                    this.addChatHistoryIndicator();
                }
            }
        } catch (error) {
            console.log('Could not load chat history:', error);
        }
    }

    addChatHistoryIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-history-indicator';
        indicator.innerHTML = `
            <div style="text-align: center; padding: 10px; background: #f0f9ff; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; color: #0369a1;">
                <i class="fas fa-history"></i> Previous conversations loaded
                <button class="clear-history-btn" onclick="devopsAgent.clearChatHistory()" style="margin-left: 10px; padding: 2px 8px; background: #dc2626; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">
                    Clear History
                </button>
            </div>
        `;
        this.chatMessages.insertBefore(indicator, this.chatMessages.firstChild);
    }

    async clearChatHistory() {
        if (confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
            try {
                const response = await fetch('https://devops-agent-948325778469.northamerica-northeast2.run.app/api/chat-history', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: this.userId })
                });
                
                if (response.ok) {
                    // Clear the chat messages
                    this.chatMessages.innerHTML = '';
                    showToast('Chat history cleared successfully!');
                } else {
                    showToast('Failed to clear chat history. Please try again.');
                }
            } catch (error) {
                console.error('Error clearing chat history:', error);
                showToast('Failed to clear chat history. Please try again.');
            }
        }
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

    addMessage(content, sender, shouldScroll = true) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('message-content-wrapper');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        // Handle markdown-like formatting
        const formattedContent = this.formatMessage(content);
        contentDiv.innerHTML = formattedContent;
        
        contentWrapper.appendChild(contentDiv);
        
        // Add save to PDF button for bot responses
        if (sender === 'bot') {
            const actionDiv = document.createElement('div');
            actionDiv.classList.add('message-actions');
            
            const saveButton = document.createElement('button');
            saveButton.classList.add('save-pdf-btn');
            saveButton.innerHTML = '<i class="fas fa-file-pdf"></i> Save to PDF';
            saveButton.title = 'Save this response as PDF';
            
            saveButton.addEventListener('click', () => {
                this.saveToPDF(content);
            });
            
            actionDiv.appendChild(saveButton);
            contentWrapper.appendChild(actionDiv);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentWrapper);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Only scroll if shouldScroll is true (for new messages)
        if (shouldScroll) {
            // Use requestAnimationFrame to ensure DOM is updated before scrolling
            requestAnimationFrame(() => {
                this.scrollToBottom();
                // Double check scroll after a brief delay to handle any layout shifts
                setTimeout(() => this.scrollToBottom(), 200);
            });
        }
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
        // Always use direct Cloud Run URL for API calls
        const apiUrl = 'https://devops-agent-948325778469.northamerica-northeast2.run.app/api/chat';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                user_id: this.userId 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response || 'Sorry, I couldn\'t process your request.';
    }

    scrollToBottom() {
        const lastMessage = this.chatMessages.lastElementChild;
        if (lastMessage) {
            lastMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }
    }

    ensureMessageVisible() {
        const lastMessage = this.chatMessages.lastElementChild;
        if (lastMessage) {
            setTimeout(() => {
                lastMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end',
                    inline: 'nearest'
                });
            }, 150);
        }
    }

    saveToPDF(content) {
        // Create a clean version of the content for PDF
        const cleanContent = this.cleanContentForPDF(content);
        
        // Create a new window with the content formatted for PDF
        const printWindow = window.open('', '_blank');
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>DevOps AI Assistant Response</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        border-bottom: 2px solid #10b981;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        color: #10b981;
                        margin: 0;
                        font-size: 24px;
                    }
                    .timestamp {
                        color: #666;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                    .content {
                        margin: 20px 0;
                    }
                    code {
                        background-color: #f5f5f5;
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-family: 'Courier New', monospace;
                        border: 1px solid #ddd;
                    }
                    strong {
                        color: #2d3748;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🤖 DevOps AI Assistant Response</h1>
                    <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
                </div>
                <div class="content">
                    ${cleanContent}
                </div>
                <div class="footer">
                    Generated by DevOps AI Assistant | Visit: https://rameshsurapathi.com/agents/devops-agent
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                // Close the window after a delay to allow printing
                setTimeout(() => {
                    printWindow.close();
                }, 1000);
            }, 500);
        };
        
        // Show success toast
        showToast('PDF download initiated! Use your browser\'s print dialog to save as PDF.');
    }

    cleanContentForPDF(content) {
        // Convert markdown-style formatting to HTML suitable for PDF
        let cleaned = content
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Wrap in paragraphs
        return `<p>${cleaned}</p>`;
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

// Initialize the DevOps Agent when DOM is loaded
let devopsAgent;
document.addEventListener('DOMContentLoaded', () => {
    devopsAgent = new DevOpsAgent();
    highlightCode();
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';
