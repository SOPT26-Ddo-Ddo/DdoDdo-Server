var express = require('express');
var router = express.Router();
const authUtil = require('../middlewares/auth');
const homeController = require('../controllers/home')

router.get('/', authUtil.checkToken, homeController.getHome);

module.exports = router;