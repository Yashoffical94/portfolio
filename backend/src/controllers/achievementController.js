const Achievement = require('../models/Achievement')
const asyncW      = require('../utils/asyncWrapper')

exports.getAchievements = asyncW(async (req, res) => {
  const achievements = await Achievement.find().sort({ order: 1, date: -1 })
  res.json({ success: true, achievements })
})
exports.createAchievement = asyncW(async (req, res) => {
  const ach = await Achievement.create(req.body)
  res.status(201).json({ success: true, achievement: ach })
})
exports.updateAchievement = asyncW(async (req, res) => {
  const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!ach) return res.status(404).json({ success: false, message: 'Achievement not found' })
  res.json({ success: true, achievement: ach })
})
exports.deleteAchievement = asyncW(async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Achievement deleted' })
})
