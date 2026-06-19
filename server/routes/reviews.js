import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'product_id and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const { rows } = await req.app
      .get('db')
      .query(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [product_id, req.userId, rating, comment || ''],
      )

    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create review' })
  }
})

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params

    const { rows } = await req.app
      .get('db')
      .query(
        'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
        [productId],
      )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

export default router
