module.exports = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development'
  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Server error'

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate field value' })
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map((e) => e.message).join(', ')
    return res.status(400).json({ success: false, message: msg })
  }
  // JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }

  res.status(status).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  })
}
