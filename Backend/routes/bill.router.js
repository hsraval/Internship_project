const express = require('express');
const router = express.Router();

const {
    getBills,
    getSingleBill,
    downloadBillPDF
} = require('../controllers/bill.controller');

const protect = require('../middleware/auth.middleware');

// 🔹 Admin - Get all bills
router.get('/',protect,getBills);

// 🔹 User/Admin - Get single bill
router.get('/:id', protect, getSingleBill);

// 🔹 Download PDF
router.get('/:id/download', protect, downloadBillPDF);

module.exports = router;