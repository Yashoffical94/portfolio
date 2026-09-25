const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
}, { timestamps: true })

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

AdminSchema.methods.comparePassword = async function(candidatePw) {
  return bcrypt.compare(candidatePw, this.password)
}

AdminSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('Admin', AdminSchema)
