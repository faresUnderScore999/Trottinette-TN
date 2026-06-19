import express from 'express'
import { authMiddleware } from '../auth.js'

const router = express.Router()

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    let queryText =
      'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id'
    const queryParams = []

    if (category) {
      queryText += ' WHERE c.slug = $1'
      queryParams.push(category)
    }

    queryText += ' ORDER BY p.id DESC'
    const { rows } = await req.app.get('db').query(queryText, queryParams)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const { rows } = await req.app
      .get('db')
      .query(
        'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = $1',
        [slug],
      )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product = rows[0]

    // Fetch reviews for this product
    const { rows: reviews } = await req.app
      .get('db')
      .query(
        'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
        [product.id],
      )

    product.reviews = reviews

    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product details' })
  }
})

// POST /api/products
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category_id, name, description, price, stock, image_url, specs } = req.body

    // Check if user is admin
    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can create products' })
    }

    if (!category_id || !name || !price) {
      return res.status(400).json({ error: 'category_id, name, and price are required fields.' })
    }

    const slug = req.app.get('slugify')(name) + '-' + Math.floor(Math.random() * 1000)
    const finalSpecs = specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : '{}'

    const { rows } = await req.app.get('db').query(
      `INSERT INTO products (category_id, name, slug, description, price, stock, image_url, specs)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [category_id, name, slug, description, price, stock || 0, image_url || '', finalSpecs],
    )

    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// PUT /api/products/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { category_id, name, description, price, stock, image_url, specs } = req.body

    // Check if user is admin
    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can update products' })
    }

    const finalSpecs = specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : '{}'

    const { rows } = await req.app.get('db').query(
      `UPDATE products 
        SET category_id = $1, name = $2, description = $3, price = $4, stock = $5, image_url = $6, specs = $7
        WHERE id = $8 RETURNING *`,
      [category_id, name, description, price, stock, image_url, finalSpecs, id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Check if user is admin
    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can delete products' })
    }

    const { rows } = await req.app
      .get('db')
      .query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully', product: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
