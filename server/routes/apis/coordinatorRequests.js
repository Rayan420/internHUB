const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/:coordinatorId').get(applicationsController.getCoordinatorLetterRequests);
router.route('/:coordinatorId/applications').get(applicationsController.getCoordinatorApplications);

module.exports = router;