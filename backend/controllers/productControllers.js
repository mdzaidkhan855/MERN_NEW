import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/product.js'
import APIFilters from '../utils/apiFilters.js';
import ErrorHandler from '../utils/errorHandler.js';

// Getlist of product => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res)=>{

    const resPerPage = 4;
    const apiFiletrs = new APIFilters(Product, req.query).search().filters();

    let products = await apiFiletrs.query;
    let filteredCount = products.length;

    apiFiletrs.pagination(resPerPage);
    products = await apiFiletrs.query.clone();
    //const products = await Product.find();
    res.status(200).json(
        {filteredCount,products}
    )
})

// Create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res)=>{

    req.body.user = req.user._id;
    const product = await Product.create(req.body);

    res.status(200).json({product})
})

// get single product => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors( async (req, res, next)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }else{
        res.status(200).json({product})
    }
    
})


// Update single product => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res)=>{
    let product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }else{
        product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true})
        res.status(200).json({product})
    }
    
})

// Delete single product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }else{
        await product.deleteOne()
        res.status(200).json({message:"Product deleted"})
    }
    
})

/// ROUTER FOR PRODUCT REVIEW 

// Create/update product review => /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res,next)=>{

    const {rating, comment, productId} = req.body

    const review = {
        user:req.user._id,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed =  product?.reviews.find((r)=>{
        r.user.toString() === req.user._id.toString()
    })

    if(isReviewed){
        product.reviews.forEach((review)=>{
            if(r.user.toString() === req.user._id.toString())
            {
                review.comment = comment
                review.rating = rating
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }

    product.rating = 
        product.reviews.reduce((acc,item)=>item.rating + acc, 0) / 
        product.reviews.length;

    await product.save({validateBeforeSave:false});
    
    res.status(200).json({success:true})
    
})

// All reviews for a product review => /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews:product.reviews
    })
})

// Delete product review => /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res,next)=>{
    
    let product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews =  product?.reviews.filter((review)=>{
        review._id.toString() !== req.query.id.toString()
    })

    const numOfReviews = reviews.length;

    const rating = 
               numOfReviews === 0 ? 0 : product.reviews.reduce((acc,item)=>item.rating + acc, 0) / numOfReviews
        

    product = await product.findByIdAndUpdate(req.query.productId,{reviews,numOfReviews, rating},{new:true})
    
    res.status(200).json({success:true,product})
    
})