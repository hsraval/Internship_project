const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "confirmed", "stitching", "ready", "delivered", "cancelled"],
    default: "pending"
  },

  stitching: {
    type: {
      type: Boolean,
      default: false
    },
    instructions: {
      type: String
    }
  },

  measurements: {
    chest: Number,
    waist: Number,
    shoulder: Number,
    sleeveLength: Number,
    neck: Number,
    length: Number
  },

  address: {
    addressLine: String,
    city: String,
    pincode: String
  },

  isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

// Single indexes (for simple queries)
orderSchema.index({ userId: 1 });          // get user orders
orderSchema.index({ status: 1 });          // filter by status
orderSchema.index({ createdAt: -1 });      // sorting latest
orderSchema.index({ isDeleted: 1 });       // soft delete filter

// User orders sorted by latest
orderSchema.index({ userId: 1, createdAt: -1 });

// Admin filtering by status + latest
orderSchema.index({ status: 1, createdAt: -1 });

// Main admin query (VERY IMPORTANT)
orderSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('order',orderSchema);