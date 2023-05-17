const express = require('express');
const router = express.Router();
const departmentContorller = require('../../controllers/departmentController');
router.route('/').post(departmentContorller.hadndleNewDepartment );


module.exports = router;