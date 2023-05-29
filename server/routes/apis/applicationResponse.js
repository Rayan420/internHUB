const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/:id/:applicationAnswer').put(applicationsController.respondToApplication);
router.route('/internship/:id').delete(applicationsController.deleteApplication);
router.route('/letter/:id').delete(applicationsController.deleteLetter);

module.exports = router;
