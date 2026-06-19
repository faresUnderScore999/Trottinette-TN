import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await req.app.get('db').query('SELECT * FROM categories ORDER BY name ASC')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export default router
