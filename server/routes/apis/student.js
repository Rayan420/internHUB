const express = require('express');
const router = express.Router();
const handleStudentController = require('../../controllers/handleStudentController');

router.route('/').post( handleStudentController.handleNewStudent);


module.exports = router;