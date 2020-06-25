var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const userController = require('../controllers/user');
const upload = require('../modules/multer');

router.post('/signup', upload.single('profileImg'), userController.signUp);
router.post('/signin', userController.signIn);
router.get('/profile/:id', userController.getProfileId);
router.get('/profile', userController.getProfile);
router.post('/profile', authUtil.checkToken, upload.single('profileImg'), userController.updateProfile);

module.exports = router;
