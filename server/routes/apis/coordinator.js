const express = require('express');
const router = express.Router();
const handleCoordinator = require('../../controllers/handleCoordinator');
const applicationsController = require('../../controllers/applicationsController');

router.route('/').post(handleCoordinator.handleNewCoordinator);
router.route('/:email').get(handleCoordinator.getCoordinatorInfo);
router.route('/:id').get(applicationsController.getCoordinatorLetterRequests);
module.exports = router;