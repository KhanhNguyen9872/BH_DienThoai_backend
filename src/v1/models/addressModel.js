const db = require('../utils/mysql');

/**
 * Get all addresses belonging to a user.
 */
const getAddressesByUser = async (userId) => {
    const query = 'SELECT id, full_name, address, phone FROM address WHERE user_id = ?';
    const [addresses] = await db.promise().query(query, [userId]);
    return addresses;
};

/**
 * Get a single address by addressId for a specific user.
 */
const getAddressByIdAndUser = async (addressId, userId) => {
    const query = 'SELECT id, full_name, address, phone FROM address WHERE id = ? AND user_id = ?';
    const [address] = await db.promise().query(query, [addressId, userId]);
    return address;
};

/**
 * Create a new address for a user.
 */
const createAddress = async (userId, fullName, address, phone) => {
    const query = 'INSERT INTO address (user_id, full_name, address, phone) VALUES (?, ?, ?, ?)';
    const [result] = await db.promise().query(query, [userId, fullName, address, phone]);
    return result.insertId;  // return the newly created address's ID
};

/**
 * Delete an address by addressId for a specific user.
 */
const deleteAddressByIdAndUser = async (addressId, userId) => {
    const query = 'DELETE FROM address WHERE id = ? AND user_id = ?';
    const [result] = await db.promise().query(query, [addressId, userId]);
    return result.affectedRows;  // how many rows were deleted
};

/**
 * Update an existing address by addressId for a specific user.
 */
const updateAddressByIdAndUser = async (addressId, userId, fullName, address, phone) => {
    const query = `
        UPDATE address
        SET full_name = ?, address = ?, phone = ?
        WHERE id = ? AND user_id = ?
    `;
    const [result] = await db.promise().query(query, [fullName, address, phone, addressId, userId]);
    return result.affectedRows;  // how many rows were updated
};

module.exports = {
    getAddressesByUser,
    getAddressByIdAndUser,
    createAddress,
    deleteAddressByIdAndUser,
    updateAddressByIdAndUser
};
