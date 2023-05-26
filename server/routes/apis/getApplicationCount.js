const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/').get(applicationsController.getApplicationCount);

module.exports = router;