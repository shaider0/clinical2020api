const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true
  },
  studyId: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: true
  },
  consentDate: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Patient', patientSchema)
