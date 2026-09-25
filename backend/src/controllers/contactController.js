const ContactMessage = require('../models/ContactMessage')
const asyncW         = require('../utils/asyncWrapper')

exports.submitContact = asyncW(async (req, res) => {
  const { name, email, subject, message, company, projectType } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required' })
  }
  const msg = await ContactMessage.create({ name, email, subject, message, company, projectType })
  res.status(201).json({ success: true, message: 'Message sent successfully', id: msg._id })
})

exports.getMessages = asyncW(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 })
  res.json({ success: true, count: messages.length, messages })
})

exports.getMessage = asyncW(async (req, res) => {
  const msg = await ContactMessage.findById(req.params.id)
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
  if (!msg.read) {
    msg.read   = true
    msg.status = 'read'
    await msg.save()
  }
  res.json({ success: true, message: msg })
})

exports.updateMessageStatus = asyncW(async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
  res.json({ success: true, message: msg })
})

exports.deleteMessage = asyncW(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Message deleted' })
})
