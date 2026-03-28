const express=require("express");
const router=express.Router();
const {limiter,GeneralLimiter}=require("../middleware/rate.limiter");
const {register,login,logout,forgotPassword,resetPassword}=require("../controllers/auth.controller");

router.post("/register",register);
router.post("/login",limiter,login);
router.post("/logout",logout);
router.post("/forgot-password",limiter, forgotPassword);
router.post("/reset-password/:token", limiter,resetPassword);

module.exports=router;