const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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

module.exports = mongoose.model('order',orderSchema);