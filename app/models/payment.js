const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  completedFields: {
    type: Number,
    required: true
  },
  minutesPerField: {
    type: Number,
    required: true
  },
  billableHours: {
    type: Number,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  invoiceTotal: {
    type: Number,
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

module.exports = mongoose.model('Payment', paymentSchema)
