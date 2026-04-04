const express = require('express');
const router = express.Router();

const {
    getBills,
    getSingleBill,
    downloadBillPDF
} = require('../controllers/bill.controller');

// 🔹 Admin - Get all bills
router.get('/', isAuthenticated, isAdmin, getBills);

// 🔹 User/Admin - Get single bill
router.get('/:id', isAuthenticated, getSingleBill);

// 🔹 Download PDF
router.get('/:id/download', isAuthenticated, downloadBillPDF);

module.exports = router;