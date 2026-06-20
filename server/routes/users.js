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

    // Build the SET clause dynamically – only include fields with a non‑empty value
    const updates = []
    const values = []
    let paramCount = 1

    const addField = (field, value) => {
      // Treat undefined, null, or whitespace‑only strings as "empty" → skip
      if (value !== undefined && value !== null && value.trim() !== '') {
        updates.push(`${field} = $${paramCount++}`)
        values.push(value)
      }
    }

    addField('first_name', first_name)
    addField('last_name', last_name)
    addField('phone', phone)
    addField('address', address)
    addField('city', city)
    addField('postal_code', postal_code)
    addField('country', country)
    // is_admin is NOT included – this prevents privilege escalation

    // If nothing to update, return the current user data without running an UPDATE
    if (updates.length === 0) {
      const { rows } = await req.app.get('db').query(
        `SELECT id, email, first_name, last_name, phone, address, city, postal_code, country, is_admin
         FROM users WHERE id = $1`,
        [req.userId],
      )
      return res.json(rows[0])
    }

    // Build the final query
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, phone, address, city, postal_code, country, is_admin
    `

    values.push(req.userId) // add userId as the last parameter

    const { rows } = await req.app.get('db').query(query, values)

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user profile' })
  }
})

export default router
