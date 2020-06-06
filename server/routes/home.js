var express = require('express');
var router = express.Router();
const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const jwt = require('../modules/jwt');
const GroupModel = require('../models/group');

/* GET users listing. */
router.get('/', async (req, res) => {
    const token = req.headers.token;
    if (!token) {
        return res.json(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
    }
    const user = await jwt.verify(token);
    // idx, name, profileMsg 가져옴
    if (user === TOKEN_EXPIRED) {
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }
    if (user === TOKEN_INVALID) {
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }
    if (user.idx === undefined) {
        return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    
    const groupResult = await GroupModel.getGroupAllRead(user.idx);
    let on = [], off = [];
    for(let group of groupResult){
        delete group.groupPwd;
        if (group.finish === 0)
            on.push(group);
        else
            off.push(group);
    }
    
    const data = {
        idx: user.idx,
        name: user.name,
        profileMsg: user.profileMsg,
        groupOn: on,
        groupOff: off
    };

    return res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.ALL_POST_SUCCESS, data));

    
});

module.exports = router;