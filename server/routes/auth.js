const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.handleLogin);

module.exports = router; // export router to be used in server.js