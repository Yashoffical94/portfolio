const SocialLink = require('../models/SocialLink')
const asyncW     = require('../utils/asyncWrapper')

exports.getSocials = asyncW(async (req, res) => {
  const socials = await SocialLink.find({ visible: true }).sort({ order: 1 })
  res.json({ success: true, socials })
})
exports.getAllSocials = asyncW(async (req, res) => {
  const socials = await SocialLink.find().sort({ order: 1 })
  res.json({ success: true, socials })
})
exports.createSocial = asyncW(async (req, res) => {
  const social = await SocialLink.create(req.body)
  res.status(201).json({ success: true, social })
})
exports.updateSocial = asyncW(async (req, res) => {
  const social = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!social) return res.status(404).json({ success: false, message: 'Social link not found' })
  res.json({ success: true, social })
})
exports.deleteSocial = asyncW(async (req, res) => {
  await SocialLink.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Social link deleted' })
})
