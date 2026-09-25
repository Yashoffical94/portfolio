const express = require('express')
const router  = express.Router()

const { getProfile }      = require('../controllers/profileController')
const { getProjects, getProject } = require('../controllers/projectController')
const { getSkills }       = require('../controllers/skillController')
const { getExperience }   = require('../controllers/experienceController')
const { getAchievements } = require('../controllers/achievementController')
const { getSocials }      = require('../controllers/socialController')
const { submitContact }   = require('../controllers/contactController')

router.get('/profile',           getProfile)
router.get('/projects',          getProjects)
router.get('/projects/:id',      getProject)
router.get('/skills',            getSkills)
router.get('/experience',        getExperience)
router.get('/achievements',      getAchievements)
router.get('/socials',           getSocials)
router.post('/contact',          submitContact)

module.exports = router
