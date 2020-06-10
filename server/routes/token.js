var express = require('express');
var router = express.Router();

const jwt = require('../modules/jwt');
const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const UserModel = require('../models/user');

router.get('/', async (req, res) => {
    const id = 'bobae'; // specific id
    const user = await UserModel.getUserById(id);
    if (user[0] === undefined) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    const {
        token,
        _
    } = await jwt.sign(user[0]);

    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
            token: token
        }));
});
module.exports = router;
