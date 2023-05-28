const express = require('express');
const router = express.Router();

const { getNotifications, readNotifications } = require('../../controllers/notificationController');

router.route('/:userId').get(getNotifications);
router.route('/:userId/:notificationId').put(readNotifications);


module.exports = router;