const multer = require("multer");

// Allowed file types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// Use memory storage (IMPORTANT for Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer instance
const multerUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter
});

// ================= EXISTING (DO NOT CHANGE) =================
const uploadImages = (req, res, next) => {
  multerUpload.array("uploadedImages", 5)(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

// ================= NEW (FOR CATEGORY SINGLE IMAGE) =================
const uploadSingleImage = (req, res, next) => {
  multerUpload.single("image")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = {
  uploadImages,       // for product (multiple)
  uploadSingleImage   // for category (single)
};