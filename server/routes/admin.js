import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// GET /api/admin/orders
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const query = `
      SELECT o.*,
             u.first_name, u.last_name, u.email, u.phone,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
    const { rows } = await req.app.get('db').query(query)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch admin orders' })
  }
})

// GET /api/admin/orders/:orderId
router.get('/orders/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params

    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const { rows: orderRows } = await req.app.get('db').query(
      `SELECT o.*, u.first_name, u.last_name, u.email, u.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [orderId],
    )
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    const order = orderRows[0]

    const { rows: items } = await req.app.get('db').query(
      `SELECT oi.*, p.name, p.slug, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId],
    )
    order.items = items

    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch admin order details' })
  }
})

// PUT /api/orders/:orderId/status
router.put('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const { rows } = await req.app
      .get('db')
      .query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, orderId])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
