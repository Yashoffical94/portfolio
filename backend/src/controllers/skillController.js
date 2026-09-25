const Skill  = require('../models/Skill')
const asyncW = require('../utils/asyncWrapper')

exports.getSkills = asyncW(async (req, res) => {
  const skills = await Skill.find({ visible: true }).sort({ order: 1, name: 1 })
  res.json({ success: true, skills })
})
exports.createSkill = asyncW(async (req, res) => {
  const skill = await Skill.create(req.body)
  res.status(201).json({ success: true, skill })
})
exports.updateSkill = asyncW(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' })
  res.json({ success: true, skill })
})
exports.deleteSkill = asyncW(async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Skill deleted' })
})
