const jwt = require('../modules/jwt');
const encrypt = require('../modules/encryption');
const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const UserModel = require('../models/user');

const user = {
    signUp: async (req, res) => {
        const {
            id,
            pwd,
            name,
            gender,
            profileMsg
        } = req.body;

        // empty value
        if (!id || !pwd || !name || !gender) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        // duplicated id
        if (await UserModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        }

        let profileImg = null
        // profile img 있을 시, 데이터 추가
        if (req.file !== undefined) {
            profileImg = req.file.location; // 파일 데이터
            // image type check
            const type = req.file.mimetype.split('/')[1];
            if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
                return res.status(CODE.BAD_REQUEST)
                    .send(util.fail(CODE.BAD_REQUEST, MSG.UNSUPPORTED_TYPE));
            }
        }

        const salt = encrypt.makeSalt();
        const newPwd = encrypt.encryption(pwd, salt);

        const idx = await UserModel.signup(id, newPwd, salt, name, gender, profileMsg, profileImg);
        if (idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                userId: id
            }));
    },
    signIn: async (req, res) => {
        // request body 에서 데이터 가져오기
        const {
            id,
            pwd
        } = req.body;

        // request data 확인 - 없다면 Null Value 반환
        if (!id || !pwd) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }


        // 아이디가 존재하는가?
        if (!await UserModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const user = await UserModel.getUserById(id);
        if (user[0] === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        // pwd 확인
        if (user[0].pwd !== encrypt.encryption(pwd, user[0].salt)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }

        const {
            token,
            _
        } = await jwt.sign(user[0]);


        // 성공 - login success와 함께 user Id 반환
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                accessToken: token
            }));
    },
    getProfileId: async (req, res) => {
        const id = req.params.id;
        if (!id) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        // 아이디가 존재하는가?
        if (!await UserModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        const user = await UserModel.getUserById(id)
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, {
                userId: user[0].id,
                name: user[0].name,
                gender: user[0].gender,
                profileMsg: user[0].profileMsg,
                profileImg: user[0].profileImg
            }));
    },
    getProfile: async (req, res) => {
        const userList = await UserModel.getUserList()
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, {
                userList
            }));
    },
    updateProfile: async (req, res) => {
        const userIdx = req.decoded.idx;
        if (req.file === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.PROFILE_NO_IMAGE));
        }

        const profileImg = req.file.location; // 파일 데이터
        // data check - undefined
        if (profileImg === undefined || !userIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.PROFILE_NO_IMAGE));
        }
        // image type check
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }

        const result = await UserModel.updateProfile(userIdx, profileImg);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.PROFILE_SUCCESS, result));
    }
}

module.exports = user;
