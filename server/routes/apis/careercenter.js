const express = require('express');
const router = express.Router();
const {handleNewCareerCenter, getCareerCenterInfo} = require('../../controllers/careerCenterController');
router.route('/').post(handleNewCareerCenter );
router.route('/:email').get(getCareerCenterInfo);


module.exports = router;