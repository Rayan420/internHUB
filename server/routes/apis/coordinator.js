const express = require('express');
const router = express.Router();
const handleCoordinator = require('../../controllers/handleCoordinator');

router.route('/').post(handleCoordinator.handleNewCoordinator);
router.route('/:email').get(handleCoordinator.getCoordinatorInfo);
module.exports = router;