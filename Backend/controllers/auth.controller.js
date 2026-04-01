const jwt=require("jsonwebtoken");
const model=require("../models/user.model");
const bcrypt=require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register= async(req,res) =>{
    const {name,email,passwordHash}=req.body;

    try{
        const data=await model.findOne({email});

        if(data){
            return res.status(400).json({success:false,msg:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const password=await bcrypt.hash(passwordHash,salt);

        await model.create({name,email,passwordHash:password});

        return res.status(201).json({success:true,msg:"User Registered successfully"});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

exports.login= async(req,res) =>{

    const {email,password}=req.body;
    
    if(!email?.trim() || !password?.trim()){
        return res.status(400).json({msg:"All field required"});
    }

    try{
        const user=await model.findOne({email});
        
        if(!user){
            return res.status(400).json({msg:"Invalid Email or password"});
        }
        
        const ismatch=await bcrypt.compare(password,user.passwordHash);
        
        if(!ismatch){
            return res.status(400).json({msg:"Invalid Email or password"});
        }

        if(user.deleted || !user.isActive){
            return res.status(403).json({
                msg: "Account is deactivated ot deleted. Please contact admin"
            });
        }

        user.lastLoginAt=new Date();
        await user.save();

        const token=jwt.sign(
            {id:user._id,email:user.email,role:user.role},
            process.env.SECRET_KEY,
            {expiresIn:"1d"}
        );

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:24*60*60*1000
        });

        res.status(200).json({msg:"Login successfully"});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

exports.logout=(req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({msg:"Logged out successfully"});
    }catch(err){
        return res.status(500).json(err.message);
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                msg: "Email is required"
            });
        }

        const user = await model.findOne({ email });

        if (!user) {
            return res.json({
                success: true,
                msg: "If email exists, reset link sent"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const html = `
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password.</p>
            <p>Click the button below to reset it. This link will expire in 15 minutes.</p>
            <a href="${resetUrl}" 
               style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
               Reset Password
            </a>
            <p>If you did not request this, please ignore this email.</p>
        `

        await sendEmail(user.email,'Reset Password',html);

        res.json({
            success: true,
            msg: "If email exists, reset link sent"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                msg: "Token is required"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                msg: "Password must be at least 6 characters"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await model.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired token"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        user.passwordHash = newPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            success: true,
            msg: "Password reset successful"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
};