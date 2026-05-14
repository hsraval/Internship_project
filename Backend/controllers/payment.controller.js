const Razorpay = require("razorpay");
const crypto = require("crypto");

const Bill = require("../models/bill.model");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ================= CREATE PAYMENT ORDER =================
exports.createPaymentOrder = async (req, res, next) => {
    try {

        const { billId } = req.body;

        const bill = await Bill.findById(billId);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        if (bill.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Bill already paid"
            });
        }

        const options = {
            amount: bill.totalAmount * 100,
            currency: "INR",
            receipt: bill.invoiceNumber
        };

        const order = await razorpay.orders.create(options);

        bill.paymentOrderId = order.id;
        await bill.save();

        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (err) {
        next(err);
    }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res, next) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const bill = await Bill.findOne({
            paymentOrderId: razorpay_order_id
        });

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        bill.paymentStatus = "paid";
        bill.paymentId = razorpay_payment_id;
        bill.paidAt = new Date();

        await bill.save();

        return res.status(200).json({
            success: true,
            message: "Payment successful"
        });

    } catch (err) {
        next(err);
    }
};