const { default: mongoose } = require('mongoose');
const Order = require('../models/order.model')
const Product = require('../models/product.model')
const Bill = require('../models/bill.model')
const User = require('../models/user.model')

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
        const orderItems = [];

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

            const unitPrice = product.pricePerMeter;

            const itemTotal = unitPrice * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,        // 🔥 IMPORTANT FIX
                quantity: item.quantity,
                price: unitPrice           // unit price
            });

            // item.price = unitPrice;
            totalAmount += itemTotal;
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
        const order = await Order.create({ userId,items:orderItems,stitching,measurements,address,totalAmount})

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
        let { page=1,limit=5,status} = req.query;

        page = Number(page);
        limit = Number(limit);

        if(page<1 || limit<1){
            return res.status(400).json({success:false,message:"page and limit must be postive value"})
        }
        const skip = (page-1)*limit;

        const filter = { isDeleted:false }

        if(status){
            filter.status = status;
        }

        const orders = await Order.find(filter).skip(skip).limit(limit).sort({createdAt:-1})

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
        const role = req.user.role;
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Please Enter Valid ID"})
        }

        // const order = await Order.findOne({userId,_id:id,isDeleted:false})
        let order;

        // Admin can view any order
        if (role === "admin") {
            order = await Order.findOne({ _id: id, isDeleted: false }).populate("items.product");
        } else {
        // Normal user can view only own order
            order = await Order.findOne({ userId, _id: id, isDeleted: false }).populate("items.product");
        }
        
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

        if (status === "delivered") {
            const existingBill = await Bill.findOne({ order: order._id });

            if (!existingBill) {
                const items = order.items.map(item => ({
                    product: item.product,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                }));

                const subtotal = items.reduce((acc, i) => acc + i.total, 0);

                const bill = await Bill.create({
                    order: order._id,
                    user: order.userId,
                    invoiceNumber: `INV-${Date.now()}`,
                    items,
                    subtotal,
                    totalAmount: subtotal,
                    billingAddress: order.address,
                });
            }
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

        const order = await Order.findById({ _id:id,userId});
        if(!order || order.isDeleted){
            return res.status(404).json({success:false,message:"Order Not Found"})
        }

        if(order.status !== 'pending'){
            return res.status(400).json({success:false,message:"Order Can't Be Updated After Confirmation"})
        }

        const { items,stitching,measurements,address } = req.body;

        if(!Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "Items must be a non-empty array"
            });
        }

        let totalAmount = 0;

        if(items && items.length>0){

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

        if(stitching !== undefined) order.stitching = stitching;
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

        const order = await Order.findById({_id:id,userId});

        if(!order || order.isDeleted){
            return res.status(404).json({success:false,message:"Order Not found"})
        }

        if(order.status !== 'pending'){
            return res.status(400).json({success:false,message:"Can Not Cancle Order"})
        }

        order.status = 'cancelled'
        await order.save();

        return res.status(200).json({success:true,message:"Order Cancelled Succeesfully..!"})
    }catch(err){
        next(err)
    }
}