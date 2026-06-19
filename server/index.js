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

// Make shared utilities available to routers
app.set('db', db)
app.set('authMiddleware', authMiddleware)
app.set('generateToken', generateToken)
app.set('slugify', (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
})

// Import routers
import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import reviewsRouter from './routes/reviews.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import cartRouter from './routes/cart.js'
import ordersRouter from './routes/orders.js'
import uploadRouter from './routes/upload.js'
import aiRouter from './routes/ai.js'
import searchRouter from './routes/search.js'
import adminRouter from './routes/admin.js'

// Register routes
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/ai', aiRouter)
app.use('/api/search', searchRouter)
app.use('/api/admin', adminRouter)

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
