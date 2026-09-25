const Profile = require('../models/Profile')
const asyncW  = require('../utils/asyncWrapper')

exports.getProfile = asyncW(async (req, res) => {
  let profile = await Profile.findOne()
  if (!profile) profile = await Profile.create({})
  res.json({ success: true, profile })
})

exports.updateProfile = asyncW(async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    {},
    { ...req.body },
    { new: true, upsert: true, runValidators: true }
  )
  res.json({ success: true, profile })
})
