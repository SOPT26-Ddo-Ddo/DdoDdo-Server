var express = require('express');
var router = express.Router();
const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const GroupModel = require('../models/group');
const authUtil = require('../middlewares/auth');

router.get('/', authUtil.checkToken, async (req, res) => {
    const user = req.decoded;

    const groupResult = await GroupModel.getGroupAllRead(user.idx);
    if (groupResult < 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.HOME_FAIL));
    }
    
    let on = [], off = [];
    for (let group of groupResult) {
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
        .send(util.success(statusCode.OK, resMessage.HOME_SUCCESS, data));
});

module.exports = router;