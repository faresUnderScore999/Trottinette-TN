import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { rows } = await req.app
      .get('db')
      .query(
        'SELECT id, email, first_name, last_name, phone, address, city, postal_code, country, is_admin FROM users WHERE id = $1',
        [req.userId],
      )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, phone, address, city, postal_code, country } = req.body

    const { rows } = await req.app.get('db').query(
      `UPDATE users 
        SET first_name = $1, last_name = $2, phone = $3, address = $4, city = $5, postal_code = $6, country = $7
        WHERE id = $8 
        RETURNING id, email, first_name, last_name, phone, address, city, postal_code, country, is_admin`,
      [first_name, last_name, phone, address, city, postal_code, country, req.userId],
    )

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user profile' })
  }
})

export default router
