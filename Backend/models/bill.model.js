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

// Single indexes
billSchema.index({ user: 1 });                  // user bills
billSchema.index({ paymentStatus: 1 });         // filter paid/pending
billSchema.index({ createdAt: -1 });            // sorting latest
billSchema.index({ invoiceNumber: 1 }, { unique: true }); // fast lookup

// Dashboard + revenue queries
billSchema.index({ paymentStatus: 1, createdAt: -1 });

// Monthly revenue queries
billSchema.index({ createdAt: -1, paymentStatus: 1 });

// User + recent bills
billSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bill', billSchema);