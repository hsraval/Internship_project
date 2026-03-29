const { default: mongoose } = require('mongoose');
const User = require('../models/user.model')

exports.getUsers = async (req,res,next) =>{
    try{
        let { page=1,limit=10,role,includeDeleted,search } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page-1)*limit;

        if(page<1 || limit<1){
            return res.status(400).json({success:false,message:"Invalid Paginantion Value"})
        }

        const filter = {}

        if(role){
            filter.role=role;
        }
        if(includeDeleted === "true"){
            filter.deleted = true;
        }else{
            filter.deleted = false;
            filter.isActive = true;
        }
        if(search){
            filter.$or=[
                { name:{$regex:search,$options:'i'} },
                { email:{$regex:search,$options:'i'} }
            ]
        }
        const users = await User.find(filter).skip(skip).limit(limit).sort({createdAt:-1})

        const totalUsers = await User.countDocuments(filter);

        return res.status(200).json({
            success:true,
            total:totalUsers,
            page,
            limit,
            data:users,
        })
    }catch(err){
        next(err)
    }
}

exports.singleUser = async (req,res,next) =>{
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Invalid Id"});
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"});
        }

        // user.deleted ? "deleted" : "active";

        return res.status(200).json({success:true,data:user});

    }catch(err){
        next(err)
    }
}

exports.editUser = async (req,res,next) =>{
    try{
        const { id } = req.params;
        const { name,email,role,isActive } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Invalid Id"});
        }

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"});
        }

        if(user.deleted){
            return res.status(400).json({success:false,message:'user deleted so first Restore'})
        }

        if(email && email!==user.email){
            const existingUser = await User.findOne({email,_id:{$ne:id}})
            if(existingUser){
                return res.status(400).json({success:false,message:"User with this email already exists try another one.."})
            }
        }

        if(name) user.name = name;
        if(email) user.email = email;
        if(role) user.role = role;
        if(typeof isActive === "boolean") user.isActive = isActive;
        
        await user.save();

        const updatedUser = await User.findById(id)
        return res.status(200).json({success:true,message:"User Updated Successfully",data:updatedUser})

    }catch(err){
        next(err)
    }
}

exports.deleteUser = async (req,res,next) =>{
    try{
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Invalid Id"})
        }

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }

        if(user.deleted){
            return res.status(400).json({success:false,messsage:"User Already Deleted"})
        }

        user.deleted = true;
        user.isActive = false;

        await user.save();

        return res.status(200).json({success:true,message:"User Deleted Successfully"})
    }catch(err){
        next(err)
    }
}

exports.restoreUser = async (req,res,next) =>{
    try{
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Invalid Id"})
        }

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }

        if(!user.deleted){
            return res.status(400).json({success:false,messsage:"User Already Active"})
        }

        user.deleted = false;
        user.isActive = true;

        await user.save();

        const restoredUser = await User.findById(id);

        return res.status(200).json({success:true,message:"User Restored Successfully",data:restoredUser})
        
    }catch(err){
        next(err)
    }
}