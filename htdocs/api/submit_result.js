import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let data = req.body;
  if (typeof req.body === 'string') {
    try {
      data = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid JSON' });
    }
  }

  let username = data?.username ? String(data.username).trim() : null;
  if (username && username.length > 50) {
    username = username.substring(0, 50);
  }

  const total = data?.total !== undefined ? parseInt(data.total, 10) : null;
  const score = data?.score !== undefined ? parseInt(data.score, 10) : null;
  const time_taken = data?.time_taken !== undefined ? parseInt(data.time_taken, 10) : null;

  if (total === null || score === null || isNaN(total) || isNaN(score)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid total or score' });
  }

  try {
    await sql`
      INSERT INTO results (username, score, total, time_taken, created_at) 
      VALUES (${username}, ${score}, ${total}, ${time_taken}, NOW())
    `;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('submit_result error:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}
