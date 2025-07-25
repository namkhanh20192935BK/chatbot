document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Check if user is logged in
    const currentUser = localStorage.getItem('chatbot_username');
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Update user header to show current user
    updateUserHeader(currentUser);

    function updateUserHeader(username) {
        const userHeader = document.getElementById('user-header');
        if (userHeader) {
            userHeader.innerHTML = `
                <div class="user-info">
                    <span class="current-user">Welcome, ${username}!</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            `;
        }
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + sender;
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        // Trigger reflow and re-apply animation
        void msgDiv.offsetWidth;
        msgDiv.style.animation = '';
        msgDiv.style.animation = 'chat-fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Add this function to send messages to backend
    async function sendMessageToBackend(message) {
      const response = await fetch(window.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser, message })
      });
      const data = await response.json();
      return data.response;
    }

    // For demonstration, let's assume you have a function handleUserInput
    async function handleUserInput(message) {
      // Display user message in UI (existing logic)
      appendMessage(message, 'user');

      // Get AI response from backend
      const aiResponse = await sendMessageToBackend(message);

      // Display AI response in UI (existing logic)
      appendMessage(aiResponse, 'bot');
    }

    sendBtn.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            handleUserInput(message);
            userInput.value = '';
        }
    });
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                handleUserInput(message);
                userInput.value = '';
            }
        }
    });
});

// Global logout function
function logout() {
    localStorage.removeItem('chatbot_username');
    window.location.href = 'login.html';
} 