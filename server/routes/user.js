var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.get('/profile/:id', userController.getProfileId);
router.get('/profile', userController.getProfile);

module.exports = router;
