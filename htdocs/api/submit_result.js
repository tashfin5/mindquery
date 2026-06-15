import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let data = req.body;
  if (typeof req.body === 'string') {
    try { data = JSON.parse(req.body); } catch(e){}
  }

  const username = data.username || 'Anonymous';
  const score = parseInt(data.score, 10) || 0;
  const total = parseInt(data.total, 10) || 0;
  const time_taken = parseInt(data.time_taken, 10) || 0;

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO results (username, score, total, time_taken)
      VALUES (${username}, ${score}, ${total}, ${time_taken})
    `;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('submit_result error:', error);
    res.status(500).json({ success: false, error: 'Database error', details: error.message });
  }
}
