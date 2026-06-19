import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import bcrypt from 'bcryptjs'
import db from './db.js'
import { chat } from './ai.js'
import { generateToken, authMiddleware } from './auth.js'
import { v2 as cloudinary } from 'cloudinary'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Helper function to create clean slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// ============== CATEGORIES ==============
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// ============== PRODUCTS ==============
app.get('/api/products', async (req, res) => {
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
    const { rows } = await db.query(queryText, queryParams)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const { rows } = await db.query(
      'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = $1',
      [slug],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product = rows[0]

    // Fetch reviews for this product
    const { rows: reviews } = await db.query(
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

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { category_id, name, description, price, stock, image_url, specs } = req.body

    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can create products' })
    }

    if (!category_id || !name || !price) {
      return res.status(400).json({ error: 'category_id, name, and price are required fields.' })
    }

    const slug = slugify(name) + '-' + Math.floor(Math.random() * 1000)
    const finalSpecs = specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : '{}'

    const { rows } = await db.query(
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

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { category_id, name, description, price, stock, image_url, specs } = req.body

    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can update products' })
    }

    const finalSpecs = specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : '{}'

    const { rows } = await db.query(
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

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can delete products' })
    }

    const { rows } = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully', product: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// ============== IMAGE UPLOAD ==============
app.post('/api/upload', authMiddleware, async (req, res) => {
  try {
    const { image } = req.body

    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Only admins can upload images' })
    }

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'trottinette-tn',
      resource_type: 'auto',
    })

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

// ============== AUTHENTICATION ==============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user already exists
    const { rows: existingUsers } = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, is_admin',
      [email, hashedPassword, first_name || '', last_name || ''],
    )

    const user = rows[0]
    const token = generateToken(user.id)

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user.id)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_admin: user.is_admin,
      },
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// ============== USER PROFILE ==============
app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
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

app.put('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, phone, address, city, postal_code, country } = req.body

    const { rows } = await db.query(
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

// ============== SHOPPING CART ==============
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
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

app.post('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity } = req.body

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'product_id and quantity are required' })
    }

    // Check if product exists and has stock
    const { rows: productRows } = await db.query('SELECT stock FROM products WHERE id = $1', [
      product_id,
    ])
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (productRows[0].stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' })
    }

    // Add or update cart item
    const { rows } = await db.query(
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
    res.status(500).json({ error: err })
  }
})

app.put('/api/cart/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { cartItemId } = req.params
    const { quantity } = req.body

    if (quantity <= 0) {
      // Delete cart item
      await db.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [
        cartItemId,
        req.userId,
      ])
      return res.json({ message: 'Item removed from cart' })
    }

    const { rows } = await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, cartItemId, req.userId],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

app.delete('/api/cart/:cartItemId', authMiddleware, async (req, res) => {
  try {
    const { cartItemId } = req.params

    const { rows } = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [cartItemId, req.userId],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.json({ message: 'Item removed from cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

// ============== ORDERS ==============
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const {
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      payment_method,
    } = req.body

    // Get cart items
    const { rows: cartItems } = await db.query('SELECT * FROM cart_items WHERE user_id = $1', [
      req.userId,
    ])

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Calculate total and verify stock
    let totalPrice = 0
    for (const item of cartItems) {
      const { rows: productRows } = await db.query(
        'SELECT price, stock FROM products WHERE id = $1',
        [item.product_id],
      )

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
    const { rows: orderRows } = await db.query(
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
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))`,
        [order.id, item.product_id, item.quantity],
      )

      // Decrease product stock
      await db.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        item.product_id,
      ])
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId])

    res.status(201).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId],
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

app.get('/api/orders/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params

    const { rows: orderRows } = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.userId],
    )

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orderRows[0]

    const { rows: items } = await db.query(
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
// ============== ADMIN ORDERS ==============
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
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
    const { rows } = await db.query(query)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch admin orders' })
  }
})
// ============== ADMIN ORDER DETAILS ==============
app.get('/api/admin/orders/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params

    // Check admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    // Get order with user details
    const { rows: orderRows } = await db.query(
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

    // Get order items
    const { rows: items } = await db.query(
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
// ============== UPDATE ORDER STATUS (Admin) ==============
app.put('/api/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    // Check if user is admin
    const { rows: userRows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!userRows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    // Update order status
    const { rows } = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [
      status,
      orderId,
    ])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})
// ============== REVIEWS ==============
app.post('/api/reviews', authMiddleware, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'product_id and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const { rows } = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, req.userId, rating, comment || ''],
    )

    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create review' })
  }
})

app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params

    const { rows } = await db.query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
      [productId],
    )

    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

// ============== AI FEATURES ==============
app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const { name, category } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Product name is required for description generation.' })
    }

    const prompt = `You are a professional e-commerce copywriter for Trottinette Tunisie, a premium electric scooter and parts online shop based in Tunisia. Write an attractive, engaging, professional product description in English for a product named "${name}"${
      category ? ` in the category "${category}"` : ''
    }. Focus on quality, safety, and why electric scooter riders or repair technicians need it. Keep it under 4 sentences. Do not include markdown headers or greetings.`

    const aiRes = await chat([{ role: 'user', content: prompt }])

    const description = aiRes?.choices?.[0]?.message?.content || 'Failed to generate content.'
    res.json({ description: description.trim() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate product description using Nvidia AI' })
  }
})
// ============== SEARCH (fuzzy) ==============
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.trim().length === 0) {
      return res.json([])
    }

    const searchTerm = q.trim().toLowerCase() // 👈 force lowercase
    const query = `
        SELECT p.*, c.name as category_name,
              similarity(LOWER(p.name), $1) + similarity(LOWER(p.description), $1) AS score
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE similarity(LOWER(p.name), $1) > 0.2 
          OR similarity(LOWER(p.description), $1) > 0.2
        ORDER BY score DESC, p.name ASC
        LIMIT 50
      `
    const { rows } = await db.query(query, [searchTerm])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// Serve static frontend files (if they exist)
const publicDir = path.join(__dirname, 'public')
if (process.env.NODE_ENV === 'production' && fs.existsSync(publicDir)) {
  app.use(express.static(publicDir))
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Trottinette Tunisie Ecommerce Server running on port ${PORT}`)
})
