const mongoose = require('mongoose')

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url:      { type: String, required: true },
  icon:     { type: String, default: '' },
  label:    { type: String, default: '' },
  order:    { type: Number, default: 0 },
  visible:  { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('SocialLink', SocialLinkSchema)
