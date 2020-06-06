const pool = require('../modules/pool');
const table = 'UserGroup';

const group = {

    // 속한 그룹들 전체 조회
    getGroupAllRead: async (userIdx) => {
        const query = `SELECT * FROM sopkathon.Group AS G 
        INNER JOIN ( SELECT groupIdx FROM UserGroup WHERE userIdx = ${userIdx} ) 
        AS R ON G.groupIdx = R.groupIdx
        ORDER BY G.groupIdx`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('GroupAllRead ERROR : ', err);
            throw err;
        }
    },

    // 특정 그룹 정보 조회
    getGroupInfoRead: async (groupIdx) => {
        const query = `SELECT * FROM sopkathon.Group WHERE groupIdx=${groupIdx}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('GroupInfoRead ERROR : ', err);
            throw err;
        }
    },

    // 특정 그룹 사용자들 조회
    getGroupUserRead: async (groupIdx) => {
        const query = `SELECT * FROM User AS U
        INNER JOIN ( SELECT userIdx FROM UserGroup WHERE groupIdx = ${groupIdx} ) 
        AS R ON U.userIdx = R.userIdx`;

        try {

            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('GroupUserRead ERROR : ', err);
            throw err;
        }
    }


}


module.exports = group;