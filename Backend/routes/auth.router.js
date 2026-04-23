const express=require("express");
const router=express.Router();
const {limiter,GeneralLimiter}=require("../middleware/rate.limiter");
const {getMe,register,login,logout,forgotPassword,resetPassword}=require("../controllers/auth.controller");
const protect=require("../middleware/auth.middleware");

router.get('/me', protect, getMe) 
router.post("/register",register);
router.post("/login",limiter,login);
router.post("/logout",logout);
router.post("/forgot-password",limiter, forgotPassword);
router.post("/reset-password/:token", limiter,resetPassword);

module.exports=router;