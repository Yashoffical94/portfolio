const mongoose = require('mongoose')

const ContactMessageSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  subject:     { type: String, default: '' },
  message:     { type: String, required: true },
  company:     { type: String, default: '' },
  projectType: { type: String, default: '' },
  read:        { type: Boolean, default: false },
  status:      { type: String, enum: ['new','read','replied','archived'], default: 'new' },
}, { timestamps: true })

module.exports = mongoose.model('ContactMessage', ContactMessageSchema)
