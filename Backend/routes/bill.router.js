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

// 🔹 Download PDF (temporarily without auth for testing)
router.get('/:id/download', downloadBillPDF);

// 🔹 Temporary: Create bill for specific order (for testing)
router.get('/create/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const Order = require('../models/order.model');
        const Bill = require('../models/bill.model');
        
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        // Check if bill already exists
        const existingBill = await Bill.findOne({ order: id });
        if (existingBill) {
            return res.status(400).json({ success: false, message: 'Bill already exists' });
        }
        
        // Create bill
        const items = order.items.map(item => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        }));
        
        const subtotal = items.reduce((acc, i) => acc + i.total, 0);
        
        const bill = await Bill.create({
            order: order._id,
            user: order.userId,
            invoiceNumber: `INV-${Date.now()}`,
            items,
            subtotal,
            totalAmount: subtotal,
            billingAddress: order.address,
            paymentStatus: 'pending'
        });
        
        res.status(201).json({ success: true, message: 'Bill created successfully', data: bill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;