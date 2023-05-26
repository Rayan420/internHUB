const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/:careerCenterId/applications').get(applicationsController.getCareerCenterApplications);
router.route('/:id/sgk').put(applicationsController.sendSGK);

module.exports = router;