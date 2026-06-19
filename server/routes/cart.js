import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await req.app.get('db').query(
      `SELECT c.*, p.name, p.price, p.image_url, p.slug 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = $1 
        ORDER BY c.created_at DESC`,
      [req.userId],
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity } = req.body

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'product_id and quantity are required' })
    }

    // Check if product exists and has stock
    const { rows: productRows } = await req.app
      .get('db')
      .query('SELECT stock FROM products WHERE id = $1', [product_id])
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (productRows[0].stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' })
    }

    // Add or update cart item
    const { rows } = await req.app.get('db').query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, product_id)
   DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
   RETURNING *`,
      [req.userId, product_id, quantity],
    )

    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

router.put('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { cartItemId } = req.params
    const { quantity } = req.body

    if (quantity <= 0) {
      // Delete cart item
      await req.app
        .get('db')
        .query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cartItemId, req.userId])
      return res.json({ message: 'Item removed from cart' })
    }

    const { rows } = await req.app
      .get('db')
      .query('UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [
        quantity,
        cartItemId,
        req.userId,
      ])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

router.delete('/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { cartItemId } = req.params

    const { rows } = await req.app
      .get('db')
      .query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *', [
        cartItemId,
        req.userId,
      ])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.json({ message: 'Item removed from cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

export default router
