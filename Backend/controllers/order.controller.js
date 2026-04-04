const { default: mongoose } = require('mongoose');
const Order = require('../models/order.model')
const Product = require('../models/product.model')

exports.createOrder = async (req,res,next) =>{
    try{
        const userId = req.user.id;
        const { items,stitching,measurements,address } = req.body;

        if(!Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "Items must be a non-empty array"
            });
        }

        let totalAmount = 0;

        for(let item of items){

            if (!item.product || !item.quantity) {
                return res.status(400).json({
                message: "Each item must have product and quantity"
                });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({
                message: "Quantity must be greater than 0"
                });
            }

            const product = await Product.findById(item.product)

            if(!product || product.isDeleted){
                return res.status(404).json({success:false,message:"Product Not Found"})
            }

            const price = item.quantity * product.pricePerMeter;
            item.price = price;
            totalAmount += price;
        }

        if (!address || !address.city || !address.pincode) {
            return res.status(400).json({
                message: "Complete address is required"
            });
        }

        if (measurements) {
            const fields = ["chest", "waist", "shoulder", "length"];

            for (let field of fields) {
                if (measurements[field] && measurements[field] <= 0) {
                    return res.status(400).json({
                        message: `Invalid ${field} measurement`
                    });
                }
            }
        }
        const order = await Order.create({ userId,items,stitching,measurements,address,totalAmount})

        return res.status(201).json({success:true,message:"Order Created Successfully",data:order});
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
        let { page=1,limit=5,status,stitching} = req.query;

        page = Number(page);
        limit = Number(limit);

        if(page<1 || limit<1){
            return res.status(400).json({success:false,message:"page and limit must be postive value"})
        }
        const skip = (page-1)*limit;
        
        const filter = { isDeleted:false }
        
        if (status) {
            const validStatus = [
                "pending",
                "confirmed",
                "stitching",
                "ready",
                "delivered",
                "cancelled"
            ];

            if (!validStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value"
                });
            }

            filter.status = status;
        }
        if (stitching !== undefined) {
            if (stitching === "true" || stitching === "false") {
                filter["stitching.type"] = stitching === "true";
            } else {
                return res.status(400).json({
                    success: false,
                    message: "stitching must be true or false"
                });
            }
        }

        const orders = await Order.find(filter).skip(skip).limit(limit).sort({CreatedAt:-1})

        const totalOrders = await Order.countDocuments(filter)

        return res.status(200).json({
            success:true,
            page,
            totalPage:Math.ceil(totalOrders/limit),
            totalOrders,
            data:orders
        })
    }catch(err){
        next(err)
    }
}

exports.getOrderById = async (req,res,next) =>{
    try{
        const userId = req.user.id;
        const id = req.params.id;

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
        const id = req.params.id;

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
        const id = req.params.id;

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
        const id = req.params.id;

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

exports.updateOrderDetail = async (req,res,next) =>{
    try{
        const userId = req.user.id;
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const order = await Order.findOne({_id:id,userId});
        if(!order || order.isDeleted){
            return res.status(404).json({success:true,message:"Order Not Found"})
        }

        if(order.status !== 'pending'){
            return res.status(400).json({success:false,message:"Order Can't Be Updated After Confirmation"})
        }

        const { items,stitching,measurements,address } = req.body;

        let totalAmount = 0;

        if(items && items.length>0){

            if(!Array.isArray(items) || items.length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Items must be a non-empty array"
                });
            }

            const updatedItems = [];

            for(let item of items){

                if (!item.product || !item.quantity) {
                    return res.status(400).json({
                    message: "Each item must have product and quantity"
                    });
                }
                if (item.quantity <= 0) {
                    return res.status(400).json({
                    message: "Quantity must be greater than 0"
                    });
                }
                const product = await Product.findById(item.product)
    
                if(!product || product.isDeleted){
                    return res.status(404).json({success:false,message:"Product Not Found"})
                }
                const price = item.quantity * product.pricePerMeter;
                
                updatedItems.push({
                    product:product._id,
                    quantity:item.quantity,
                    price
                })
                totalAmount += price;
            }
            order.items = updatedItems;
            order.totalAmount = totalAmount;
        }

        if (stitching) {
            if (stitching.type !== undefined) {
                order.stitching.type = stitching.type;
            }
            if (stitching.instructions !== undefined) {
                order.stitching.instructions = stitching.instructions;
            }
        }
        if(measurements) {
            for (let key in measurements) {
                if (measurements[key] <= 0) {
                    return res.status(400).json({
                        message: `Invalid ${key}`
                    });
                }
            }
            order.measurements = measurements;
        }
        
        if (address) {
            if (!address.city || !address.pincode) {
                return res.status(400).json({
                    message: "Invalid address"
                });
            }
            order.address = address;
        }

        await order.save();

        return res.status(200).json({success:true,message:"Order Updated Successfully",data:order})

    }catch(err){
        next(err)
    }
}

exports.cancleOrder = async (req,res,next) =>{
    try{
        const id = req.params.id;
        const userId = req.user.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        const order = await Order.findById({_id:id,userId}) 

        if(!order || order.isDeleted){
            return res.status(404).json({success:false,message:"Order Not found"})
        }

        if(order.status !== 'pending'){
            return res.status(400).json({success:false,message:"Can Not Cancle Order"})
        }

        order.status = 'cancelled'
        await order.save();
    }catch(err){
        next(err)
    }
}   