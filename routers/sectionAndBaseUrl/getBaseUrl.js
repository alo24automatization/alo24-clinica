const { Router } = require('express')
const router = Router()
const config = require('config')

router.get('/', async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl')
    if (baseUrl) {
      return res.json({ baseUrl: baseUrl })
    }

    res.status(404).json({ error: 'Url manzil topilmadi' })
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
})

module.exports = router
