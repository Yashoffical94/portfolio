const mongoose = require('mongoose')

const ExperienceSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  role:         { type: String, required: true },
  type:         { type: String, enum: ['job','internship','freelance','opensource','competition','achievement'], default: 'job' },
  startDate:    { type: Date },
  endDate:      { type: Date },
  current:      { type: Boolean, default: false },
  description:  { type: String, default: '' },
  technologies: [{ type: String }],
  url:          { type: String, default: '' },
  logo:         { type: String, default: '' },
  order:        { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Experience', ExperienceSchema)
