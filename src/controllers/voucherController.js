const VoucherModel = require('../models/voucherModel');

class VoucherController {
    /**
     * Check voucher validity (GET /:voucherCode)
     */
    async checkVoucher(req, res) {
        try {
            const { voucherCode } = req.params;

            const vouchers = await VoucherModel.getVoucherByCode(voucherCode);
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
    }

    /**
     * Use voucher (POST /:voucherCode)
     */
    async useVoucher(req, res) {
        try {
            const { voucherCode } = req.params;
            const userId = req.user.userId; // from getUserId

            const vouchers = await VoucherModel.getVoucherByCode(voucherCode);
            if (vouchers.length === 0) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            const voucher = vouchers[0];

            // Check if voucher has remaining uses
            if (voucher.count <= 0) {
                return res.status(400).json({ message: 'Voucher has no remaining uses' });
            }

            // Convert user_id field to array if needed
            let usedIds = voucher.user_id;
            if (!Array.isArray(usedIds)) {
                usedIds = [usedIds];
            }

            // Check if user already used the voucher
            if (usedIds.includes(userId)) {
                return res.status(400).json({ message: 'User has already used this voucher' });
            }

            // Add userId, decrement count
            usedIds.push(userId);
            const updatedCount = voucher.count - 1;

            // Update the voucher in the database
            await VoucherModel.updateVoucherCountAndUserId(
                voucher.id,
                updatedCount,
                usedIds
            );

            return res.status(201).json({ message: 'Voucher used successfully' });
        } catch (error) {
            console.error('Error using voucher:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new VoucherController();
