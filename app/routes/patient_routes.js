const express = require('express')
const passport = require('passport')
const Patient = require('../models/patient')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET /patients
router.get('/patients', requireToken, (req, res, next) => {
  Patient.find()
    .then(patients => {
      return patients.map(patient => patient.toObject())
    })
    .then(patients => res.status(200).json({ patients: patients }))
    .catch(next)
})

// SHOW
// GET /patients/5a7db6c74d55bc51bdf39793
router.get('/patients/:id', requireToken, (req, res, next) => {
  Patient.findById(req.params.id)
    .then(handle404)
    .then(patient => res.status(200).json({ patient: patient.toObject() }))
    .catch(next)
})

// CREATE
// POST /patients
router.post('/patients', requireToken, (req, res, next) => {
  req.body.patient.owner = req.user.id

  Patient.create(req.body.patient)
    .then(patient => {
      res.status(201).json({ patient: patient.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /patients/5a7db6c74d55bc51bdf39793
router.patch('/patients/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.patient.owner

  Patient.findById(req.params.id)
    .then(handle404)
    .then(patient => {
      requireOwnership(req, patient)
      return patient.update(req.body.patient)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /patients/5a7db6c74d55bc51bdf39793
router.delete('/patients/:id', requireToken, (req, res, next) => {
  Patient.findById(req.params.id)
    .then(handle404)
    .then(patient => {
      requireOwnership(req, patient)
      patient.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
