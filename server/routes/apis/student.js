const express = require('express');
const router = express.Router();
const handleStudentController = require('../../controllers/handleStudentController');

router.route('/').post( handleStudentController.handleNewStudent);
router.route('/:email').get(handleStudentController.getStudentInfo);

module.exports = router;