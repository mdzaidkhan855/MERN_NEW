import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Order from '../models/order.js';
import ErrorHandler from '../utils/errorHandler.js';

import {getResetPasswordTemplate} from '../utils/emailTemplates.js'
import Product from '../models/product.js'


//Create new Oredr => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id        
    })

    res.status(200).json({
        order
    })
})


//Get Current user Order details => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res)=>{    
    
    const orders = await Order.find({user:req.user._id}) 

    if(!orders){
        return next(new ErrorHandler("Order not found with this user id ID", 404));
    }

    res.status(200).json({
        orders
    })
})

//Get Order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res)=>{
    
    const order = await Order.findById(req.params.id).populate("user") 

    if(!order){
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    res.status(200).json({
        order
    })
})

//Get All orders = Admin => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res)=>{    
    
    const orders = await Order.find() 

    if(!orders){
        return next(new ErrorHandler("Orders not found with this user id ID", 404));
    }

    res.status(200).json({
        orders
    })
})

//Update orders = Admin => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res)=>{    
    
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if(order?.orderStatus === 'Delivered'){
        return next(new ErrorHandler("You have already delivered", 400));
    }

    // Update product stock
    order.orderItems.forEach(async (item)=>{
        const product = await Product.findById(item?.product?.toString())
        if(!product){
            return next(new ErrorHandler("No Prouctwith this ID", 404));
        }
        product.stock = product.stock - item.quantity
        await product.save({validateBeforeSave:false});
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();    

    res.status(200).json({
        success:true
    })
})

//Delete Order  => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res)=>{
    
    const order = await Order.findById(req.params.id) 

    if(!order){
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    await order.deleteOne()
    res.status(200).json({
        success:true
    })
})






