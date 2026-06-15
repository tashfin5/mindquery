import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT id, question, choices, correct_index FROM questions ORDER BY id ASC`;
    
    const questions = rows.map(r => {
      let choices = [];
      try {
        choices = typeof r.choices === 'string' ? JSON.parse(r.choices) : r.choices;
      } catch (e) {
        choices = (r.choices || '').split(',').map(s => s.trim());
      }
      
      return {
        id: r.id,
        question: r.question,
        choices: choices || [],
        correct_index: r.correct_index
      };
    });

    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('get_questions error:', error);
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
}
