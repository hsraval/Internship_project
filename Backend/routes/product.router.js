const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const Role=require("../middleware/role.middleware");
const uploadImages=require("../middleware/upload.middleware");
const {limiter,GeneralLimiter}=require("../middleware/rate.limiter");
const 
    {createProduct,
    getActiveProduct,
    getProductById,
    getAllProduct,
    updateProduct,
    restoreProduct,
    deleteProduct}=require("../controllers/product.controller");

router.post("/",protect,Role("admin"),GeneralLimiter,uploadImages,createProduct);
router.get("/",Role("admin","user"),GeneralLimiter,getActiveProduct);
router.get("/:id",Role("admin","user"),GeneralLimiter,getProductById);
router.get("/admin",Role("admin"),GeneralLimiter,getAllProduct);
router.patch("/:id",protect,Role("admin"),GeneralLimiter,uploadImages,updateProduct);
router.patch("/:id/restore",protect,Role("admin"),GeneralLimiter,restoreProduct);
router.delete("/:id",protect,Role("admin"),GeneralLimiter,deleteProduct);


module.exports=router;