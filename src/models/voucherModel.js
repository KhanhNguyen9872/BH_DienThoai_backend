const db = require('../utils/mysql');

/**
 * Fetch a voucher by its code.
 */
const getVoucherByCode = async (voucherCode) => {
    const [vouchers] = await db.promise().query(
        'SELECT id, code, discount, count, limit_user, user_id FROM voucher WHERE code = ?',
        [voucherCode]
    );
    return vouchers; // This will be an array
};

/**
 * Update the voucher's count and user_id fields.
 */
const updateVoucherCountAndUserId = async (voucherId, updatedCount, updatedUserIds) => {
    await db.promise().query(
        'UPDATE voucher SET count = ?, user_id = ? WHERE id = ?',
        [updatedCount, JSON.stringify(updatedUserIds), voucherId]
    );
};

module.exports = {
    getVoucherByCode,
    updateVoucherCountAndUserId
};
