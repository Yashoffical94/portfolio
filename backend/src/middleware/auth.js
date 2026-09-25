const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = await Admin.findById(decoded.id).select('-password')
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' })
    }
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
