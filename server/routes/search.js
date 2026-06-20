import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.trim().length === 0) {
      return res.json([])
    }

    const searchTerm = q.trim().toLowerCase()

    // Weighted fuzzy similarity – higher weight on name, moderate on description and category, lower on specs
    const query = `
      SELECT 
        p.*,
        c.name AS category_name,
        (
          COALESCE(similarity(LOWER(p.name), $1), 0) * 3 +
          COALESCE(similarity(LOWER(p.description), $1), 0) * 2 +
          COALESCE(similarity(LOWER(c.name), $1), 0) * 1.5 +
          COALESCE(similarity(LOWER(p.specs::text), $1), 0) * 0.5
        ) AS score
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 
        similarity(LOWER(p.name), $1) > 0.2
        OR similarity(LOWER(p.description), $1) > 0.2
        OR similarity(LOWER(c.name), $1) > 0.2
        OR similarity(LOWER(p.specs::text), $1) > 0.2
      ORDER BY score DESC, p.name ASC
      LIMIT 50
    `

    const { rows } = await req.app.get('db').query(query, [searchTerm])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

export default router
