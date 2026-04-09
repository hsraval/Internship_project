// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({

//   name: {
//     type: String,
//     required: true
//   },

//   isActive: {
//     type: Boolean,
//     default: true
//   },

//   isDeleted: {
//     type: Boolean,
//     default: false
//   }

// }, { timestamps: true });

// module.exports = mongoose.model("category", categorySchema);

// ===================

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  images:
  {
    url:{
      type:String,
      required:true
    },
    public_id:{
      type:String,
      required:true
    }
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

module.exports = mongoose.model("category", categorySchema);