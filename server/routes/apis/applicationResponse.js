const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/:id/:applicationAnswer').put(applicationsController.respondToApplication);
module.exports = router;
