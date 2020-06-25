const GroupModel = require('../models/group');
const UserModel = require('../models/user');

const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const manito = require('../modules/manito');

const group = {
    createGroup: async (req, res) => {
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
    
    },
    getInGroup: async (req, res) => {
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
    },
    getGroup: async (req, res) => {
        const groupIdx = req.params.groupIdx;
        const groupResult = await GroupModel.getGroupInfoRead(groupIdx);
        const userResult = await GroupModel.getGroupUserRead(groupIdx);
    
        // 해당 그룹 존재하지 않음
        if (groupResult.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_FAIL));
        }
    
        // 그룹에 유저 없음
        if (userResult.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.GROUP_NO_ONE));
        }
    
        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.GROUP_SUCCESS, {
                groupInfo: groupResult[0],
                groupUser: userResult
            }));
    },
    setManito: async (req, res) => {
        const groupIdx = req.params.groupIdx;
        const userResult = await GroupModel.getGroupUserRead(groupIdx); //특정 그룹 사용자 조회
        // 해당 그룹 존재하지 않음
        if (userResult.length < 2) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.MANITO_LACK_USER));
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
            .send(util.success(statusCode.OK, resMessage.MANITO_SUCCESS, {
                'myManito': userManito[0]
            }));
    }
};

module.exports = group;