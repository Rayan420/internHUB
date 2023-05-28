const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/files/:coordinatorId').put(applicationsController.sendForms);
router.route('/files/:coordinatorId').get(applicationsController.getForms);

module.exports = router;
