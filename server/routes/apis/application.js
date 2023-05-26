const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/').post(applicationsController.createApplication);
router.route('/:studentId').get(applicationsController.getStudentApplicationRequests);
module.exports = router;
