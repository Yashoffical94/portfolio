const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, enum: ['Languages','Frontend','Backend','AI-ML','Tools','Other'], default: 'Other' },
  icon:        { type: String, default: '' },
  proficiency: { type: Number, min: 1, max: 100, default: 80 },
  order:       { type: Number, default: 0 },
  visible:     { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Skill', SkillSchema)
