const express = require("express");
const router = express.Router();

const {
  createCategory,
  getActiveCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  restoreCategory
} = require("../controllers/category.controller");

const protect = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");
const {uploadImages,uploadSingleImage} = require("../middleware/upload.middleware"); 

router.post(
  "/",
  protect,
  Role("admin"),
  uploadSingleImage,
  createCategory
);

router.get("/", getActiveCategories);

router.get("/admin", protect, Role("admin"), getAllCategories);

router.patch(
  "/:id/restore",
  protect,
  Role("admin"),
  restoreCategory 
);

router.patch(
  "/:id",
  protect,
  Role("admin"),
  uploadSingleImage,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  Role("admin"),
  deleteCategory
);

module.exports = router;