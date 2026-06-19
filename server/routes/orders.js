import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// POST /api/orders
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      payment_method,
    } = req.body

    // Get cart items
    const { rows: cartItems } = await req.app
      .get('db')
      .query('SELECT * FROM cart_items WHERE user_id = $1', [req.userId])

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Calculate total and verify stock
    let totalPrice = 0
    for (const item of cartItems) {
      const { rows: productRows } = await req.app
        .get('db')
        .query('SELECT price, stock FROM products WHERE id = $1', [item.product_id])

      if (productRows.length === 0) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` })
      }

      const product = productRows[0]

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for product ${item.product_id}` })
      }

      totalPrice += product.price * item.quantity
    }

    // Create order
    const { rows: orderRows } = await req.app.get('db').query(
      `INSERT INTO orders (user_id, total_price, payment_method, shipping_address, shipping_city, shipping_postal_code, shipping_country)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
      [
        req.userId,
        totalPrice,
        payment_method,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_country,
      ],
    )

    const order = orderRows[0]

    // Create order items and update stock
    for (const item of cartItems) {
      await req.app.get('db').query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))`,
        [order.id, item.product_id, item.quantity],
      )

      // Decrease product stock
      await req.app
        .get('db')
        .query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
          item.quantity,
          item.product_id,
        ])
    }

    // Clear cart
    await req.app.get('db').query('DELETE FROM cart_items WHERE user_id = $1', [req.userId])

    res.status(201).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await req.app.get('db').query(
      `SELECT o.*,
              COALESCE(
                (
                  SELECT json_agg(
                    json_build_object(
                      'id', oi.id,
                      'product_id', oi.product_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', p.name,
                      'slug', p.slug,
                      'image_url', p.image_url
                    )
                  )
                  FROM order_items oi
                  JOIN products p ON oi.product_id = p.id
                  WHERE oi.order_id = o.id
                ),
                '[]'::json
              ) AS items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.userId],
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:orderId
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params

    const { rows: orderRows } = await req.app
      .get('db')
      .query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.userId])

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orderRows[0]

    const { rows: items } = await req.app.get('db').query(
      `SELECT oi.*, p.name, p.slug, p.image_url FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = $1`,
      [order.id],
    )

    order.items = items

    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export default router
