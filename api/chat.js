const axios = require('axios');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required', response: '' });
  }
  const contextMessages = [{ role: 'user', content: message }];
  try {
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
    await supabase.from('conversation').insert([
      {
        conversation_id: userId,
        mesages: [{ user: message, ai: aiMessage }],
        created_at: new Date().toISOString()
      }
    ]);
    res.json({ response: aiMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from OpenAI API', response: '' });
  }
}; 