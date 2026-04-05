const express = require('express');
const router = express.Router();

const {
    getBills,
    getSingleBill,
    downloadBillPDF
} = require('../controllers/bill.controller');

// 🔹 Admin - Get all bills
router.get('/',getBills);

// 🔹 User/Admin - Get single bill
router.get('/:id', getSingleBill);

// 🔹 Download PDF
router.get('/:id/download', downloadBillPDF);

module.exports = router;