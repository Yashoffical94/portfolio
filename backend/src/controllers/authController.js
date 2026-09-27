const jwt    = require('jsonwebtoken')
const Admin  = require('../models/Admin')
const asyncW = require('../utils/asyncWrapper')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

exports.login = asyncW(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' })
  }
  const admin = await Admin.findOne({ email }).select('+password')
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
  const token = signToken(admin._id)
  res.json({ success: true, token, admin: admin.toJSON() })
})

exports.getMe = asyncW(async (req, res) => {
  res.json({ success: true, admin: req.admin })
})

exports.changePassword = asyncW(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required' })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' })
  }

  // req.admin comes from the auth middleware without the password field — refetch
  const admin = await Admin.findById(req.admin._id).select('+password')
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' })
  }

  admin.password = newPassword
  await admin.save() // pre-save hook hashes it

  res.json({ success: true, message: 'Password updated successfully' })
})
