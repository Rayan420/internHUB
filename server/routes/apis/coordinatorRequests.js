const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');

router.route('/:id').get(applicationsController.getCoordinatorLetterRequests);
module.exports = router;