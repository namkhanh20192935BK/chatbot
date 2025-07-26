import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', response: '' });
  }

  const { userId, message } = req.body;
  console.log(`[POST /api/chat] userId: ${userId}, message: ${message}`);
  
  if (!userId || !message) {
    console.log('Thiếu userId hoặc message');
    return res.status(400).json({ error: 'userId and message are required', response: '' });
  }

  // Create context messages for OpenAI
  const contextMessages = [{ role: 'user', content: message }];

  try {
    console.log('[OpenAI] Gửi request tới OpenAI...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // Updated to use the correct model name
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

    // Save chat history to Supabase
    console.log('[Supabase] Chuẩn bị insert vào bảng conversation:', {
      conversation_id: userId,
      mesages: [{ user: message, ai: aiMessage }],
      created_at: new Date().toISOString()
    });
    
    const data_insert = [
      {
        conversation_id: userId,
        mesages: [{ user: message, ai: aiMessage }],
        created_at: new Date().toISOString()
      }
    ];
    
    const { data, error: supabaseError } = await supabase.from('conversation').insert(data_insert);
    if (supabaseError) {
      console.error('[Supabase] Lỗi khi insert:', supabaseError);
    } else {
      console.log('[Supabase] Insert thành công:', JSON.stringify(data_insert, null, 2));
    }

    res.status(200).json({ response: aiMessage });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI API', response: '' });
  }
} 