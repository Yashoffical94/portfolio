const Project = require('../models/Project')
const asyncW  = require('../utils/asyncWrapper')

exports.getProjects = asyncW(async (req, res) => {
  const filter = {}
  if (req.query.featured === 'true') filter.featured = true
  if (req.query.category) filter.category = req.query.category
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })
  res.json({ success: true, count: projects.length, projects })
})

exports.getProject = asyncW(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
  res.json({ success: true, project })
})

exports.createProject = asyncW(async (req, res) => {
  const project = await Project.create(req.body)
  res.status(201).json({ success: true, project })
})

exports.updateProject = asyncW(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
  res.json({ success: true, project })
})

exports.deleteProject = asyncW(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
  res.json({ success: true, message: 'Project deleted' })
})
