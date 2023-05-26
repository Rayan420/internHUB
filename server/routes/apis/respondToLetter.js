const express = require('express');
const router = express.Router();
const applicationsController = require('../../controllers/applicationsController');


router.route('/:id/:letterAnswer').post(applicationsController.respondToLetterRequest);




module.exports = router;