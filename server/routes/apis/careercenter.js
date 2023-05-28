const express = require('express');
const router = express.Router();
const {
    handleNewCareerCenter,
    getCareerCenterInfo, 
    createInternshipOppurtunirty,
    getInternshipOpportunities, 
    updateInternshipOpportunity,
    deleteInternshipOpportunity,
    deleteSGK
} = require('../../controllers/careerCenterController');
router.route('/').post(handleNewCareerCenter );
router.route('/:email').get(getCareerCenterInfo);
router.route('/create/:careerCenterId').post(createInternshipOppurtunirty);
router.route('/oppurtunities/:careerCenterId').get(getInternshipOpportunities);
router.route('/oppurtunities/:careerCenterId/update/:opportunityId/:operationType').put(updateInternshipOpportunity);
router.route('/oppurtunities/:careerCenterId/delete/:opportunityId').delete(deleteInternshipOpportunity);
router.route('/sgk/:careerCenterId/delete/:requestId').delete(deleteSGK);


module.exports = router;