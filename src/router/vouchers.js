const express = require('express');
const router = express.Router();
const db = require('../utils/mysql');
const { getUserId } = require('../utils/lib');

// Check voucher validity
router.get('/:voucherCode', async (req, res) => {
    try {
        const { voucherCode } = req.params;
        
        const [vouchers] = await db.promise().query(
            'SELECT id, code, discount, count, limit_user, user_id FROM voucher WHERE code = ?',
            [voucherCode]
        );

        if (vouchers.length === 0) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        const voucher = vouchers[0];
        
        // Format response
        return res.json({
            id: voucher.id,
            code: voucher.code,
            discount: voucher.discount,
            count: voucher.count,
            limit: voucher.limit_user,
            usedId: voucher.user_id
        });

    } catch (error) {
        console.error('Error checking voucher:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Use voucher
router.post('/:voucherCode', getUserId, async (req, res) => {
    try {
        const { voucherCode } = req.params;
        const userId = req.user.userId;

        const [vouchers] = await db.promise().query(
            'SELECT id, code, discount, count, limit_user, user_id FROM voucher WHERE code = ?',
            [voucherCode]
        );

        if (vouchers.length === 0) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        const voucher = vouchers[0];

        if (voucher.count <= 0) {
            return res.status(400).json({ message: 'Voucher has no remaining uses' });
        }

        let usedIds = voucher.user_id;

        if (!Array.isArray(usedIds)) {
            usedIds = [usedIds];
        }

        if (usedIds.includes(userId)) {
            return res.status(400).json({ message: 'User has already used this voucher' });
        }

        usedIds.push(userId);
        const updatedCount = voucher.count - 1;

        await db.promise().query(
            'UPDATE voucher SET count = ?, user_id = ? WHERE id = ?',
            [updatedCount, JSON.stringify(usedIds), voucher.id]
        );

        return res.status(201).json({ message: 'Voucher used successfully' });

    } catch (error) {
        console.error('Error using voucher:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;