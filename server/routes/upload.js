import express from 'express'
import { authMiddleware } from '../auth.js'
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { image } = req.body

    // Check if user is admin
    const { rows: userRows } = await req.app
      .get('db')
      .query('SELECT is_admin FROM users WHERE id = $1', [req.userId])
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

export default router
