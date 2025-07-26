 // Bỏ import ES module, dùng window.supabase từ CDN

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

    // Add this function to send messages to backend
    async function sendMessageToBackend(message) {
      const response = await fetch(window.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', message })
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