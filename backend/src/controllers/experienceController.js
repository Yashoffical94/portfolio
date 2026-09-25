const Experience = require('../models/Experience')
const asyncW     = require('../utils/asyncWrapper')

exports.getExperience = asyncW(async (req, res) => {
  const experience = await Experience.find().sort({ order: 1, startDate: -1 })
  res.json({ success: true, experience })
})
exports.createExperience = asyncW(async (req, res) => {
  const exp = await Experience.create(req.body)
  res.status(201).json({ success: true, experience: exp })
})
exports.updateExperience = asyncW(async (req, res) => {
  const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' })
  res.json({ success: true, experience: exp })
})
exports.deleteExperience = asyncW(async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Experience deleted' })
})
