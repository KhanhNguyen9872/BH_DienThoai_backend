// models/userModel.js
const db = require('../utils/mysql');

const getAccountDataByAccountId = async (accountId) => {
    const query = `
        SELECT
            user.id AS id,
            account.username AS username,
            user.email AS email,
            user.first_name AS firstName,
            user.last_name AS lastName,
            account.lock_acc AS locked
        FROM
            account
        JOIN
            user ON account.user_id = user.id
        WHERE
            account.id = ?
    `;
    const [rows] = await db.promise().query(query, [accountId]);
    return rows;
};

const getAddressDataByUserId = async (userId) => {
    const query = `
        SELECT
            id,
            full_name AS fullName,
            address,
            phone
        FROM
            address
        WHERE
            user_id = ?
    `;
    const [rows] = await db.promise().query(query, [userId]);
    return rows;
};

module.exports = {
    getAccountDataByAccountId,
    getAddressDataByUserId
};
