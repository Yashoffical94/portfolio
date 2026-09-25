const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')

const { updateProfile }           = require('../controllers/profileController')
const { createProject, updateProject, deleteProject } = require('../controllers/projectController')
const { createSkill, updateSkill, deleteSkill }       = require('../controllers/skillController')
const { createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')
const { createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController')
const { getAllSocials, createSocial, updateSocial, deleteSocial } = require('../controllers/socialController')
const { getMessages, getMessage, updateMessageStatus, deleteMessage } = require('../controllers/contactController')

// All admin routes require auth
router.use(auth)

// Profile
router.put('/profile', updateProfile)

// Projects
router.post('/projects',        createProject)
router.put('/projects/:id',     updateProject)
router.delete('/projects/:id',  deleteProject)

// Skills
router.post('/skills',          createSkill)
router.put('/skills/:id',       updateSkill)
router.delete('/skills/:id',    deleteSkill)

// Experience
router.post('/experience',      createExperience)
router.put('/experience/:id',   updateExperience)
router.delete('/experience/:id', deleteExperience)

// Achievements
router.post('/achievements',       createAchievement)
router.put('/achievements/:id',    updateAchievement)
router.delete('/achievements/:id', deleteAchievement)

// Social links
router.get('/socials',            getAllSocials)
router.post('/socials',           createSocial)
router.put('/socials/:id',        updateSocial)
router.delete('/socials/:id',     deleteSocial)

// Messages
router.get('/messages',           getMessages)
router.get('/messages/:id',       getMessage)
router.put('/messages/:id',       updateMessageStatus)
router.delete('/messages/:id',    deleteMessage)

module.exports = router
