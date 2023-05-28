const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/').post(applicationsController.createApplication);
router.route('/:studentId').get(applicationsController.getStudentApplicationRequests);
router.route('/files/:coordinatorId').put(applicationsController.sendForms);

module.exports = router;
