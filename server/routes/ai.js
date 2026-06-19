import express from 'express'
import { chat } from '../ai.js'

const router = express.Router()

router.post('/generate-description', async (req, res) => {
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

export default router
