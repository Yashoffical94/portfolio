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
