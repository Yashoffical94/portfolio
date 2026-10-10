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

// Rate limiting — general (relaxed in development so testing isn't blocked)
const IS_DEV = process.env.NODE_ENV === 'development'
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_DEV ? 1000 : 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict limiter for auth + contact
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_DEV ? 100 : 5,
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

// ── Production startup safety checks ──────────────
// Refuses to boot in production with placeholder/default credentials
// so a mis-deploy can never expose a publicly-known admin login.
const checkProductionSecurity = () => {
  if (process.env.NODE_ENV !== 'production') return

  const secret = process.env.JWT_SECRET || ''
  const INSECURE_SECRETS = [
    '',
    'replace_with_a_very_long_random_secret_string_at_least_64_chars',
  ]
  if (INSECURE_SECRETS.includes(secret) || secret.length < 32) {
    console.error('FATAL: Set a strong JWT_SECRET (32+ random chars) in production. Refusing to start.')
    process.exit(1)
  }

  const adminPassword = process.env.ADMIN_PASSWORD || ''
  const INSECURE_PASSWORDS = ['', 'Admin@123']
  if (INSECURE_PASSWORDS.includes(adminPassword)) {
    console.error('FATAL: Set a strong ADMIN_PASSWORD in production. Refusing to start.')
    process.exit(1)
  }
  if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.includes('localhost')) {
    console.error('FATAL: Set FRONTEND_URL to your production frontend URL. Refusing to start.')
    process.exit(1)
  }
}

checkProductionSecurity()

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
