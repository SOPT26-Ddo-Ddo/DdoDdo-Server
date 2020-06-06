var express = require('express');
var router = express.Router();

router.use('/home', require('./home'));
router.use('/user', require('./user'));
router.use('/group', require('./group'));
router.use('/token', require('./token'));

module.exports = router;
