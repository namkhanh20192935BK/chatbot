const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed', history: [] });
    return;
  }
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required', history: [] });
  }
  const chatFilePath = path.join(__dirname, `../data/chat_${userId}.json`);
  if (!fs.existsSync(chatFilePath)) {
    return res.json({ history: [] });
  }
  try {
    const data = fs.readFileSync(chatFilePath, 'utf-8');
    const conversation = JSON.parse(data);
    res.json({ history: conversation });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi đọc file chat', history: [] });
  }
}; 