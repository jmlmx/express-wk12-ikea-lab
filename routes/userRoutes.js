const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/users', userController.createUser)//create a user
router.post('/users/login', userController.loginUser)//login a user
router.put('/users/:id', userController.updateUser)//update a user
router.delete('/:id', userController.auth, userController.deleteUser)//delete a user
//router.get('/users', userController.getUsers )//Show users
//router.post('/users/logout',userController.auth, userController.logoutUser)//logout a user

module.exports = router