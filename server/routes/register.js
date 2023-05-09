const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/:email', registerController.handleNewUser);

module.exports = router; // export router to be used in server.js