const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

// Create a new letter request
router.route('/').post(applicationsController.createLetterRequest);
router.route('/:studentId').get(applicationsController.getStudentLetterRequests);



module.exports = router;