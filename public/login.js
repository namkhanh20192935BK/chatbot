document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');

    // Check if user is already logged in
    const currentUser = localStorage.getItem('chatbot_username');
    if (currentUser) {
        // Redirect to chat page if already logged in
        window.location.href = 'index.html';
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Please enter a username');
            return;
        }

        if (username.length < 3) {
            showError('Username must be at least 3 characters long');
            return;
        }

        // Save username to localStorage
        localStorage.setItem('chatbot_username', username);
        
        // Show success message and redirect
        showSuccess('Welcome, ' + username + '!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });

    function showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 14px;
            text-align: center;
        `;
        
        loginForm.appendChild(errorDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    function showSuccess(message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 14px;
            text-align: center;
        `;
        
        loginForm.appendChild(successDiv);
    }

    // Focus on username input when page loads
    usernameInput.focus();
}); 