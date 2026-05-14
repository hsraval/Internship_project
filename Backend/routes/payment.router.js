const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
    createPaymentOrder,
    verifyPayment
} = require("../controllers/payment.controller");

router.post("/create-order", protect, createPaymentOrder);

router.post("/verify", protect, verifyPayment);

module.exports = router;