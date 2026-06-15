import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const per_page = Math.min(50, Math.max(1, parseInt(req.query.per_page, 10) || 6));
  const offset = (page - 1) * per_page;

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Count total rows
    const countRows = await sql`SELECT COUNT(*) as c FROM results`;
    const total = parseInt(countRows[0].c, 10);
    const pages = Math.max(1, Math.ceil(total / per_page));

    // Fetch paginated rows
    const rows = await sql`
      SELECT id, username, score, total, time_taken, 
             TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at 
      FROM results 
      ORDER BY id DESC 
      LIMIT ${per_page} OFFSET ${offset}
    `;

    res.status(200).json({
      success: true,
      total,
      page,
      per_page,
      pages,
      results: rows
    });
  } catch (error) {
    console.error('get_results error:', error);
    res.status(500).json({ success: false, error: 'Database error', details: error.message });
  }
}
