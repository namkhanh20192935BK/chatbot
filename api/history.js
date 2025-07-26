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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', history: [] });
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required', history: [] });
  }

  try {
    // Fetch chat history from Supabase
    const { data, error } = await supabase
      .from('conversation')
      .select('*')
      .eq('conversation_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Supabase] Lỗi khi fetch history:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history', history: [] });
    }

    // Transform the data to match the expected format
    const history = data || [];
    res.status(200).json({ history });
  } catch (err) {
    console.error('Lỗi đọc chat history:', err);
    res.status(500).json({ error: 'Lỗi đọc chat history', history: [] });
  }
} 