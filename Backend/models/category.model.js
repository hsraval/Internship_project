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

categorySchema.index({ name: "text" });

categorySchema.index({ createdAt: -1 });

categorySchema.index({
  isDeleted: 1,
  isActive: 1,
  name: 1
});


module.exports = mongoose.model("category", categorySchema);