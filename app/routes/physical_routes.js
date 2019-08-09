const express = require('express')
const passport = require('passport')
const Physical = require('../models/physical')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET ALL PHYSICALS /physicals
router.get('/physicals-all', requireToken, (req, res, next) => {
  Physical.find()
    .then(physicals => {
      return physicals.map(physical => physical.toObject())
    })
    .then(physicals => res.status(200).json({ physicals: physicals }))
    .catch(next)
})

// INDEX
// GET ALL FOR ONE PATIENT /physicals
router.get('/physicals', requireToken, (req, res, next) => {
  const patientId = req.query.id
  Physical.find({patient: patientId})
    .then(physicals => {
      return physicals.map(physical => physical.toObject())
    })
    .then(physicals => res.status(200).json({ physicals: physicals }))
    .catch(next)
})

// SHOW
// GET /physicals/5a7db6c74d55bc51bdf39793
router.get('/physicals/:id', requireToken, (req, res, next) => {
  Physical.findById(req.params.id)
    .then(handle404)
    .then(physical => res.status(200).json({ physical: physical.toObject() }))
    .catch(next)
})

// CREATE
// POST /physicals
router.post('/physicals', requireToken, (req, res, next) => {
  req.body.physical.owner = req.user.id
  console.log('physical body is', req.body.physical)
  const patient = req.body.patient
  const physical = req.body.physical
  physical.patient = patient
  Physical.create(physical)
    .then(physical => {
      res.status(201).json({ physical: physical.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /physicals/5a7db6c74d55bc51bdf39793
router.patch('/physicals/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.physical.owner

  Physical.findById(req.params.id)
    .then(handle404)
    .then(physical => {
      requireOwnership(req, physical)
      return physical.update(req.body.physical)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /physicals/5a7db6c74d55bc51bdf39793
router.delete('/physicals/:id', requireToken, (req, res, next) => {
  Physical.findById(req.params.id)
    .then(handle404)
    .then(physical => {
      requireOwnership(req, physical)
      physical.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
