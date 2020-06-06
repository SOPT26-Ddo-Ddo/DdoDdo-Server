const pool = require('../modules/pool');
const encrypt = require('../modules/encryption');
const table = 'User';

const user = {
    getUserById: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id = "${id}"`;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            throw err;
        }
    },
    getUserList: async () => {
        const query = `SELECT * FROM ${table}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            throw err;
        }
    },
}

module.exports = user;
