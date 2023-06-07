const express = require("express");
const router = express.Router();
const envelopeControllers = require('../controllers/envelopes.js');
const passport = require("passport");
const { Envelope } = require("../models");

const { validateOneEnvelope } = require("../validations/validate-one-envelope");
const { validateMultipleEnvelopes } = require("../validations/validate-multiple-envelopes");
const { validateEditEnvelopes } = require("../validations/edit-envelopes")

const {
    NewEnvelopesPage,
    createEnvelopes,
    updateEnvelope,
    UpdateEnvelopePage,
    deleteEnvelope
} = require("../controllers/envelopes");

router
    .route("/setup")
    .get(NewEnvelopesPage)
    .post(validateMultipleEnvelopes, createEnvelopes)
        
router
    .route("/new")
    .get(NewEnvelopesPage)
    .post(validateOneEnvelope, createEnvelopes)

router
    .route("/update")
    .get(UpdateEnvelopePage)
    .post(validateEditEnvelopes, updateEnvelope)

router
    .route("/delete")
    .delete(deleteEnvelope)

// Routes that include an id param, calling envelope-specific controllers 
router.get('/:id', envelopeControllers.getEnvelopesByUserId)
router.put('/:id', envelopeControllers.updateEnvelope)

// Routes without id param, calling envelope-specific controllers
router.get('/', envelopeControllers.getAllEnvelopes)



module.exports = router

