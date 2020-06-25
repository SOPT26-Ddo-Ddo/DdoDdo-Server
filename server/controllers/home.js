const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const GroupModel = require('../models/group');
const UserModel = require('../models/user');

const home = {
    getHome: async (req, res) => {
        const user = await UserModel.getUserByIdx(req.decoded.idx);
        const groupResult = await GroupModel.getGroupAllRead(req.decoded.idx);
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
            idx: user[0].userIdx,
            name: user[0].name,
            profileMsg: user[0].profileMsg,
            profileImg: user[0].profileImg,
            groupOn: on,
            groupOff: off
        };
    
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.HOME_SUCCESS, data));
    }
};

module.exports = home;