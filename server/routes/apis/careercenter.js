const express = require('express');
const router = express.Router();
const handleCareerCenter = require('../../controllers/handleCareerCenter');

router.route('/').post(handleCareerCenter.handleNewCareerCenter );


module.exports = router;