import express from 'express'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user already exists
    const { rows: existingUsers } = await req.app
      .get('db')
      .query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await req.app
      .get('db')
      .query(
        'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, is_admin',
        [email, hashedPassword, first_name || '', last_name || ''],
      )

    const user = rows[0]
    const token = req.app.get('generateToken')(user.id)

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { rows } = await req.app.get('db').query('SELECT * FROM users WHERE email = $1', [email])

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const token = req.app.get('generateToken')(user.id)

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

export default router
