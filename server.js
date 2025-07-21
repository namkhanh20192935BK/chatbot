// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
dotenv.config();

// Khởi tạo Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to process chat messages
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;
  console.log(`[POST /api/chat] userId: ${userId}, message: ${message}`);
  if (!userId || !message) {
    console.log('Thiếu userId hoặc message');
    return res.status(400).json({ error: 'userId and message are required', response: '' });
  }

  // Không đọc/ghi file, chỉ gửi message hiện tại lên OpenAI
  const contextMessages = [{ role: 'user', content: message }];

  try {
    console.log('[OpenAI] Gửi request tới OpenAI...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-nano',
        messages: contextMessages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const aiMessage = response.data.choices[0].message.content;

    // Lưu lịch sử chat vào Supabase
    console.log('[Supabase] Chuẩn bị insert vào bảng conversation:', {
      conversation_id: userId,
      mesages: [{ user: message, ai: aiMessage }],
      created_at: new Date().toISOString()
    });
    const { data, error: supabaseError } = await supabase.from('conversation').insert([
      {
        conversation_id: userId,
        mesages: [{ user: message, ai: aiMessage }],
        created_at: new Date().toISOString()
      }
    ]);
    if (supabaseError) {
      console.error('[Supabase] Lỗi khi insert:', supabaseError);
    } else {
      console.log('[Supabase] Insert thành công:', data);
    }

    res.json({ response: aiMessage });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI API', response: '' });
  }
});

// Endpoint to get chat history
app.get('/api/history', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required', history: [] });
  }
  const chatFilePath = path.join(__dirname, `chat_${userId}.json`);
  if (!fs.existsSync(chatFilePath)) {
    return res.json({ history: [] });
  }
  try {
    const data = fs.readFileSync(chatFilePath, 'utf-8');
    const conversation = JSON.parse(data);
    res.json({ history: conversation });
  } catch (err) {
    console.error('Lỗi đọc file chat:', err);
    res.status(500).json({ error: 'Lỗi đọc file chat', history: [] });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 