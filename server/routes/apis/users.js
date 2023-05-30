const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');


router.route('/').get(usersController.getAllUsers)
    
router.route('/:email').get(usersController.getUserByEmail)    

router.route('/:id').put(usersController.updateUserInformation);   
router.route('/number').delete(usersController.getNumberOfUsers);
router.route('/delete/user/:id').delete(usersController.deleteUser);

router.route('/selecteduser/update').put(usersController.saveChanges);


module.exports = router;