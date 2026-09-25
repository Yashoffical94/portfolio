const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')
const { login, getMe } = require('../controllers/authController')

router.post('/login', login)
router.get('/me', auth, getMe)

module.exports = router
