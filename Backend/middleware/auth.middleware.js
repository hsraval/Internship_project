const JWT=require("jsonwebtoken");
const model=require("../models/user.model");

const protect=async(req,res,next)=>{
    const token=req.cookies.token;

    try{
        if(token){
            const decode=JWT.verify(token,process.env.SECRET_KEY);

            const user=await model.findById(decode.id).select("-passwordHash");
            if(!user){
                return res.status(400).json({msg:"Invalid user"});
            }

            req.user=user;
            next();
        }
        else{
            return res.status(400).json({msg:"please login first"});
        }
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

module.exports = protect;