const express = require('express');
const router = express.Router();
const { getInternshipsByDepartment, createInternshipOpportunity, updateInternshipOpportunity} = require('../../controllers/InternShipController');
router.route('/:department').get(getInternshipsByDepartment);
router.route('/').post(createInternshipOpportunity);
router.route('/:id').put(updateInternshipOpportunity);




module.exports = router;
