const express = require('express');
const router = express.Router();
const { saveSignature, getSignature } = require('../../controllers/signatureController');

router.route('/').post(saveSignature);
router.route('/:id').get(getSignature);
module.exports = router;