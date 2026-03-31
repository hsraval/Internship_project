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

  isActive: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);