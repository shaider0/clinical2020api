const mongoose = require('mongoose')

const physicalSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  bloodPressure: {
    type: String,
    required: false
  },
  heartRate: {
    type: Number,
    required: false
  },
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Physical', physicalSchema)
