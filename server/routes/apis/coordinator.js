const express = require('express');
const router = express.Router();
const handleCoordinator = require('../../controllers/handleCoordinator');

router.route('/').post(handleCoordinator.handleNewCoordinator);

module.exports = router;