const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  name:                { type: String, default: 'Your Name' },
  title:               { type: String, default: 'Full-Stack Developer & AI Engineer' },
  bio:                 { type: String, default: '' },
  aboutText:           { type: String, default: '' },
  location:            { type: String, default: '' },
  email:               { type: String, default: '' },
  avatar:              { type: String, default: '' },
  resume:              { type: String, default: '' },
  available:           { type: Boolean, default: true },
  heroTagline:         { type: String, default: 'I BUILD DIGITAL POWER.' },
  heroSubtitle:        { type: String, default: "I'm a developer focused on building software, AI-powered systems and real-world products." },
  yearsOfExperience:   { type: String, default: '3+' },
  projectsCompleted:   { type: String, default: '20+' },
  technologiesUsed:    { type: String, default: '15+' },
  githubUrl:           { type: String, default: '' },
  linkedinUrl:         { type: String, default: '' },
  twitterUrl:          { type: String, default: '' },
  instagramUrl:        { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Profile', ProfileSchema)
