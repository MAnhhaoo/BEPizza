// Router
const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

router.post('/signup', userController.createUser.bind(userController));
router.post('/signin', userController.loginUser.bind(userController));
router.put('/updateUser/:id', userController.updateUser.bind(userController));
router.get('/getUser/:id', userController.getUser.bind(userController));

module.exports = router;
