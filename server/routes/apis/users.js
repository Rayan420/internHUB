const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');


router.route('/').get(usersController.getAllUsers)
    
router.route('/:email').get(usersController.getUserByEmail)    

router.route('/:id').put(usersController.updateUserInformation);   
router.route('/number').delete(usersController.getNumberOfUsers);
 

module.exports = router;