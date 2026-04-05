const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    invoiceNumber: {
        type: String,
        unique: true,
        required:true   
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name:{ type: String, required: true },
            price: Number,
            quantity: Number,
            total: Number
        }
    ],

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    billingAddress: {
        addressLine: String,
        city: String,
        pincode: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },   
    issuedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);