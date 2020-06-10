var express = require('express');
var router = express.Router();

const GroupModel = require('../models/group');
const UserModel = require('../models/user');

const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const manito = require('../modules/manito');

const authUtil = require('../middlewares/auth');

/* 그룹 만들기 */
router.post('/', authUtil.checkToken, async (req, res) => {
    const user = req.decoded;
    const {
        groupPwd,
        name,
        numPeople,
        deadline
    } = req.body;
    if (!groupPwd || !name || !numPeople) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const result = await GroupModel.setGroup(groupPwd, name, numPeople, deadline, 0, 0, user.idx);
    if (result < 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_ADD_FAIL));
    }

    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.GROUP_ADD_SUCCESS, {
            groupIdx: result
        }));

});


/* 유저->그룹 들어가기 */
router.get('/:groupIdx/in', authUtil.checkToken, async (req, res) => {
    const user = req.decoded;
    const groupIdx = req.params.groupIdx;
    const result = await GroupModel.setInGroup(groupIdx, user.idx);
    if (result < 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_IN_FAIL));
    }

    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.GROUP_IN_SUCCESS, {
            groupIdx: result
        }));
});


/* 특정 그룹 정보 조회 */
router.get('/:groupIdx', async (req, res) => {
    const groupIdx = req.params.groupIdx;
    const groupResult = await GroupModel.getGroupInfoRead(groupIdx);
    const userResult = await GroupModel.getGroupUserRead(groupIdx);

    // 해당 그룹 존재하지 않음
    if (groupResult.length == 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
    }

    if (userResult.length == 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
    }

    res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.GROUP_SUCCESS, {
            groupInfo: groupResult[0],
            groupUser: userResult
        }));
});



/* 마니또 알고리즘 수행*/
router.get('/:groupIdx/manito', authUtil.checkToken, async (req, res) => {
    const groupIdx = req.params.groupIdx;
    const userResult = await GroupModel.getGroupUserRead(groupIdx); //특정 그룹 사용자 조회

    // 해당 그룹 존재하지 않음
    if (userResult.length == 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.MANITTO_FAIL));
    }

    const manitoList = await manito.getManito(userResult, groupIdx);
    const result = await GroupModel.setManito(groupIdx, userResult, manitoList);
    if (result < 0) {
        return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.MANITO_FAIL));
    }

    // 유저 가져오기
    const user = req.decoded;
    const userManito = await UserModel.getUserByIdx(manitoList[user.idx]);

    res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.MANITTO_SUCCESS, {
            'myManito': userManito[0]
        }));
});


module.exports = router;