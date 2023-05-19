const express = require('express');
const router = express.Router();
const {handleNewCareerCenter} = require('../../controllers/careerCenterController');
router.route('/').post(handleNewCareerCenter );


module.exports = router;