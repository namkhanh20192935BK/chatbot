const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed', history: [] });
    return;
  }
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required', history: [] });
  }
  try {
    const { data, error } = await supabase
      .from('conversation')
      .select('messages')
      .eq('conversation_id', userId)
      .order('created_at', { ascending: true });
    if (error) {
      return res.status(500).json({ error: 'Supabase error', history: [] });
    }
    // Flatten all messages arrays from all conversation rows
    const history = data.flatMap(row => row.messages || []);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history', history: [] });
  }
}; 