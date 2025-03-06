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
}

module.exports = new VoucherController();
