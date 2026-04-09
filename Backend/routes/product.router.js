const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth.middleware");
const Role=require("../middleware/role.middleware");
const {uploadImages,uploadSingleImage}=require("../middleware/upload.middleware");
const 
    {createProduct,
    getActiveProduct,
    getProductById,
    getAllProduct,
    updateProduct,
    restoreProduct,
    deleteProduct}=require("../controllers/product.controller");

router.post("/",protect,Role("admin"),uploadImages,createProduct);
router.get("/",protect,Role("admin","user"),getActiveProduct);
router.get("/:id",protect,Role("admin","user"),getProductById);
router.get("/admin",protect,Role("admin"),getAllProduct);
router.patch("/:id",protect,Role("admin"),uploadImages,updateProduct);
router.patch("/:id/restore",protect,Role("admin"),restoreProduct);
router.delete("/:id",protect,Role("admin"),deleteProduct);


module.exports=router;