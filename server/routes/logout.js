const express = require('express');
const router = express.Router();
const logOutController = require('../controllers/LogOutController');

router.get('/', logOutController.handleLogout);

module.exports = router; // export router to be used in server.js