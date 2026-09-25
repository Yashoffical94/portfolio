require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const rateLimit   = require('express-rate-limit')
const connectDB   = require('./src/config/db')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()

// Connect to DB
connectDB()

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Rate limiting — general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict limiter for auth + contact
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', generalLimiter)
app.use('/api/auth/login', strictLimiter)
app.use('/api/contact',    strictLimiter)

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() })
)

// Routes
app.use('/api/auth',  require('./src/routes/auth'))
app.use('/api',       require('./src/routes/public'))
app.use('/api/admin', require('./src/routes/admin'))

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` })
)

// Global error handler
app.use(errorHandler)

// ── Seed admin on first run ───────────────────────────
const seedAdmin = async () => {
  try {
    const Admin   = require('./src/models/Admin')
    const Profile = require('./src/models/Profile')

    const existing = await Admin.findOne()
    if (!existing) {
      await Admin.create({
        name:     'Admin',
        email:    process.env.ADMIN_EMAIL    || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
      })
      console.log('Admin account seeded from .env')
    }

    const profile = await Profile.findOne()
    if (!profile) {
      await Profile.create({})
      console.log('Default profile created')
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
  await seedAdmin()
})
