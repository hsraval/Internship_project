const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            console.log(req.user.role);
            return res.status(400).json({msg:"Access denied"});
        }
        next();
    }
}

module.exports=authorizeRoles;