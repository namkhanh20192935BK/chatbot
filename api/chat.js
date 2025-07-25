import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required', response: '' });
  }
  // Fetch existing messages for this user
  let history = [];
  try {
    const { data, error } = await supabase
      .from('conversation')
      .select('messages')
      .eq('conversation_id', userId)
      .order('created_at', { ascending: true });
    if (data && data.length > 0) {
      history = data.flatMap(row => row.messages || []);
    }
  } catch (e) {
    // Ignore, treat as empty history
  }
  // Add the new user message
  const contextMessages = [...history, { role: 'user', content: message }];
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
    // Append the assistant's reply
    const updatedMessages = [...contextMessages, { role: 'assistant', content: aiMessage }];
    // Store the new message pair as a new row (or update, depending on your schema)
    await supabase.from('conversation').insert([
      {
        conversation_id: userId,
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: aiMessage }
        ],
        created_at: new Date().toISOString()
      }
    ]);
    res.json({ response: aiMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get response from OpenAI API', response: '' });
  }
} 