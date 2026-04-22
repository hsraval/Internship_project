const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  pricePerMeter: {
    type: Number,
    required: true,
    min: 0
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true
  },

  images:[
    {
      url:{
        type:String
      },
      public_id:{
        type:String
      }
    }
  ],

  productType: {
    type: String,
    enum: ["fabric", "product"],
    default: "product"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

productSchema.index({ name: "text" });

productSchema.index({ category: 1 });

productSchema.index({ productType: 1 });

productSchema.index({ isDeleted: 1, isActive: 1 });

productSchema.index({ createdAt: -1 });

productSchema.index({
  isDeleted: 1,
  isActive: 1,
  category: 1,
  productType: 1
});

module.exports = mongoose.model("Product", productSchema);