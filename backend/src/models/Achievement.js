const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, enum: ['hackathon','certification','competitive','academic','project','award','milestone'], default: 'milestone' },
  date:        { type: Date },
  url:         { type: String, default: '' },
  icon:        { type: String, default: '' },
  order:       { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Achievement', AchievementSchema)
