const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { getUserId } = require('../utils/lib');

// Check voucher validity
router.get('/:voucherCode', voucherController.checkVoucher);

// Use voucher
router.post('/:voucherCode', getUserId, voucherController.useVoucher);

module.exports = router;
