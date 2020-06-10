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
            if (err.errno == 1062) {
                console.log('GroupAllRead ERROR : ', err.errno, err.code);
                return -1;
            }
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
            if (err.errno == 1062) {
                console.log('GroupInfoRead ERROR : ', err.errno, err.code);
                return -1;
            }
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
            if (err.errno == 1062) {
                console.log('GroupUserRead ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('GroupUserRead ERROR : ', err);
            throw err;
        }
    },
    setGroup: async (groupPwd, name, numPeople, deadline, fix, finish, leader) => {
        const fields = 'groupPwd, name, numPeople, deadline, fix, finish, leader';
        const questions = '?, ?, ?, ?, ?, ?, ?';
        const values = [groupPwd, name, numPeople, deadline, fix, finish, leader];
        const query = `INSERT INTO sopkathon.Group (${fields}) VALUES(${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('setGroup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('setGroup ERROR : ', err);
            throw err;
        }
    },
    setInGroup: async (groupIdx, userIdx) => {
        // 맨 처음 마니또 설정은 자기 자신
        const fields = 'userIdx, manito, groupIdx';
        const questions = '?, ?, ?';
        const values = [userIdx, userIdx, groupIdx];
        const query = `INSERT INTO sopkathon.UserGroup (${fields}) VALUES(${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('setInGroup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('setInGroup ERROR : ', err);
            throw err;
        }
    },
    setManito: async (groupIdx, userList, manitoList) => {
        let results = 0;
        
        // 마니또 설정 그룹 fix = 1로 설정
        let query = `UPDATE sopkathon.Group SET fix = 1 WHERE groupIdx = "${groupIdx}"`;
        try {
            let result = await pool.queryParamArr(query);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('setManito ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('setManito ERROR : ', err);
            throw err;
        }


        // 마니또 배정
        for (var i = 0; i < userList.length; i++){
            let userIdx = userList[i].userIdx;
            let manito = manitoList[userIdx];
            query = `UPDATE UserGroup SET manito = "${manito}" WHERE userIdx = "${userIdx}" AND groupIdx = "${groupIdx}"`;

            try {
                result = await pool.queryParamArr(query);
                results += (result.changedRows);
            } catch (err) {
                if (err.errno == 1062) {
                    console.log('setManito ERROR : ', err.errno, err.code);
                    return -1;
                }
                console.log('setManito ERROR : ', err);
                throw err;
            }
        }
        if (results != userList.length) return -1;
        return results;
    },
}


module.exports = group;