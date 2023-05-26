const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

// Create a new letter request
router.route('/').post(applicationsController.createLetterRequest);

// Get letter requests for a student
router.route('/:studentId').get(applicationsController.getStudentLetterRequests);

router.route('/:id/letterAnswer').post(applicationsController.respondToLetterRequest);




module.exports = router;