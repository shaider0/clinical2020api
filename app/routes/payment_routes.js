const express = require('express')
const passport = require('passport')
const Payment = require('../models/payment')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET /payments
router.get('/payments', requireToken, (req, res, next) => {
  Payment.find()
    .then(payments => {
      return payments.map(payment => payment.toObject())
    })
    .then(payments => res.status(200).json({ payments: payments }))
    .catch(next)
})

// SHOW
// GET /payments/5a7db6c74d55bc51bdf39793
router.get('/payments/:id', requireToken, (req, res, next) => {
  Payment.findById(req.params.id)
    .then(handle404)
    .then(payment => payment.toObject())
    .then(payment => res.status(200).json({ payment: payment }))
    .catch(next)
})

// CREATE
// POST /payments
router.post('/payments', requireToken, (req, res, next) => {
  req.body.payment.owner = req.user.id

  Payment.create(req.body.payment)
    .then(payment => {
      res.status(201).json({ payment: payment.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /payments/5a7db6c74d55bc51bdf39793
router.patch('/payments/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.payment.owner

  Payment.findById(req.params.id)
    .then(handle404)
    .then(payment => {
      requireOwnership(req, payment)
      return payment.update(req.body.payment)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /payments/5a7db6c74d55bc51bdf39793
router.delete('/payments/:id', requireToken, (req, res, next) => {
  Payment.findById(req.params.id)
    .then(handle404)
    .then(payment => {
      requireOwnership(req, payment)
      payment.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
