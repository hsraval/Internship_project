const { default: mongoose } = require('mongoose');
const Order = require('../models/order.model')

exports.createOrder = (req,res,next) =>{
    try{

    }catch(err){
        next(err)
    }
}

exports.getUserOrders = async (req,res,next) =>{
    try{
        const userId = req.user.id;

        const userOrders = await Order.find({userId,isDeleted:false}).populate("items.product")

        return res.status(200).json({success:true,data:userOrders})
    }catch(err){
        next(err)
    }
}

exports.getAllOrders = async (req,res,next) =>{
    try{
        const orders = await Order.find({isDeleted:false})

        return res.status(200).json({success:true,data:orders})
    }catch(err){
        next(err)
    }
}

exports.getOrderById = async (req,res,next) =>{
    try{
        const userId = req.user.id;
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const order = await Order.findOne({userId,_id:id,isDeleted:false})
        if(!order){
            return res.status(404).json({success:false,message:"Order Not Found"})
        }

        return res.status(200).json({success:true,data:order})
    }catch(err){
        next(err)
    }
}

exports.updateOrderStatus = async (req,res,next) =>{
    try{
        const { status } = req.body;
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const validStatus =[
            "pending",
            "confirmed",
            "stitching",
            "ready",
            "delivered",
            "cancelled"
        ]

        if(!validStatus.includes(status)){
            return res.status(400).json({success:false,message:"Please Enter Valid Status"})
        }

        const order = await Order.findById(id);

        if(!order || order.isDeleted){
            return res.status(404).json({success:false,message:"Order Not Found"})
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(id);

        return res.status(200).json({success:true,message:"Order Status Updated",data:updatedOrder})
    }catch(err){
        next(err)
    }
}

exports.deleteOrder = async (req,res,next) =>{
    try{
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const order = await Order.findById(id);

        if(!order || order.isDeleted){
            return res.status(404).json({success:false,message:"Order Not Found"})
        }

        order.isDeleted = true;
        await order.save();

        return res.status(200).json({success:true,message:"Order Deleted Successfully"})

    }catch(err){
        next(err)
    }
}

exports.restoreOrder = async (req,res,next) =>{
    try{
        const { id } = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const order = await Order.findById(id);

        if(!order){
            return res.status(400).json({success:false,message:"Order Not Found"})
        }
        if(!order.isDeleted){
            return res.status(400).json({success:false,message:"Order Already Restored"})
        }

        order.isDeleted = false;
        await order.save();

        const restoredOrder = await Order.findById(id);
        return res.status(200).json({success:true,data:restoredOrder})
    }catch(err){
        next(err)
    }
}