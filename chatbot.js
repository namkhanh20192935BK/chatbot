document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

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

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        userInput.value = '';
        setTimeout(() => {
            appendMessage('Hello! I am a simple chatbot. How can I help you?', 'bot');
        }, 500);
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 