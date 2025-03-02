// models/accountModel.js
const db = require('../utils/mysql');
const { md5 } = require('../utils/lib');
const crypto = require('crypto');

/**
 * Find account by credentials (username & password).
 */
async function findAccountByCredentials(username, hashedPassword) {
  const query = 'SELECT * FROM account WHERE username = ? AND password = ?';
  const [results] = await db.promise().query(query, [username, hashedPassword]);
  return results;
}

/**
 * Create user, account, and address records in a single transaction.
 */
async function createUserAccountTransaction({ username, password, email, firstName, lastName, lock, information }) {
  const promiseDb = db.promise();
  try {
    await promiseDb.beginTransaction();

    // Insert into user table
    const userQuery = 'INSERT INTO user (first_name, last_name, email) VALUES (?, ?, ?)';
    const userValues = [firstName, lastName, email];
    const [userResult] = await promiseDb.query(userQuery, userValues);
    const userId = userResult.insertId;

    // Insert into account table
    const accountQuery = 'INSERT INTO account (username, password, lock_acc, user_id) VALUES (?, ?, ?, ?)';
    const accountValues = [username, password, lock, userId];
    await promiseDb.query(accountQuery, accountValues);

    // Insert into address table (if any)
    if (information && information.length > 0) {
      for (let i = 0; i < information.length; i++) {
        const { full_name, address, phone } = information[i];
        const addressQuery = 'INSERT INTO address (user_id, full_name, address, phone) VALUES (?, ?, ?, ?)';
        const addressValues = [userId, full_name, address, phone];
        await promiseDb.query(addressQuery, addressValues);
      }
    }

    await promiseDb.commit();
    return { message: 'User, account, and address data inserted successfully' };
  } catch (error) {
    await promiseDb.rollback();
    throw error;
  }
}

/**
 * Find account by username & email (used in forgot password).
 */
async function findAccountByUsernameEmail(username, email) {
  const query = `
    SELECT a.id 
    FROM account a 
    JOIN user u ON a.user_id = u.id 
    WHERE a.username = ? AND u.email = ?
  `;
  const [rows] = await db.promise().query(query, [username, email]);
  return rows;
}

/**
 * Update password by userId.
 */
async function updatePasswordByUserId(userId, hashedPassword) {
  const query = 'UPDATE account SET password = ? WHERE user_id = ?';
  await db.promise().query(query, [hashedPassword, userId]);
}

/**
 * Find account row by the account's primary key (id).
 */
async function findAccountById(accountId) {
  const query = 'SELECT password FROM account WHERE id = ?';
  const [rows] = await db.promise().query(query, [accountId]);
  return rows;
}

/**
 * Update password by accountId (based on user_id).
 */
async function updatePasswordByAccountId(accountId, hashedPassword) {
  const query = 'UPDATE account SET password = ? WHERE user_id = ?';
  await db.promise().query(query, [hashedPassword, accountId]);
}

module.exports = {
  findAccountByCredentials,
  createUserAccountTransaction,
  findAccountByUsernameEmail,
  updatePasswordByUserId,
  findAccountById,
  updatePasswordByAccountId,
};
