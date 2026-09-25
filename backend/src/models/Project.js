const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true },
  shortDescription: { type: String, default: '' },
  description:      { type: String, default: '' },
  technologies:     [{ type: String }],
  category:         { type: String, default: 'Web' },
  image:            { type: String, default: '' },
  gallery:          [{ type: String }],
  githubUrl:        { type: String, default: '' },
  demoUrl:          { type: String, default: '' },
  date:             { type: Date,   default: Date.now },
  status:           { type: String, enum: ['active','completed','archived'], default: 'completed' },
  featured:         { type: Boolean, default: false },
  order:            { type: Number,  default: 0 },
  problem:          { type: String, default: '' },
  solution:         { type: String, default: '' },
  features:         [{ type: String }],
  challenges:       { type: String, default: '' },
  learnings:        { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)
