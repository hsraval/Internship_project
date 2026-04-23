const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const Role=require("../middleware/role.middleware");
const {uploadImages,uploadSingleImage}=require("../middleware/upload.middleware");
const {limiter,GeneralLimiter}=require("../middleware/rate.limiter");
const 
    {createProduct,
    getActiveProduct,
    getFabricProducts,
    getProductById,
    getAllProduct,
    updateProduct,
    restoreProduct,
    deleteProduct}=require("../controllers/product.controller");

router.post("/",protect,Role("admin"),GeneralLimiter,uploadImages,createProduct);
router.get("/",GeneralLimiter,getActiveProduct); // Removing Role from router.
router.get("/admin",protect,Role("admin"),GeneralLimiter,getAllProduct);
router.get("/fabric", getFabricProducts);
router.get("/:id",Role("admin","user"),GeneralLimiter,getProductById);
router.patch("/:id",protect,Role("admin"),GeneralLimiter,uploadImages,updateProduct);
router.patch("/:id/restore",protect,Role("admin"),GeneralLimiter,restoreProduct);
router.delete("/:id",protect,Role("admin"),GeneralLimiter,deleteProduct);

module.exports=router;