import Product from '../models/product.js'

// Getlist of product => /api/v1/products
export const getProducts = async (req, res)=>{

    const products = await Product.find();
    res.status(200).json({products})
}

// Create new product => /api/v1/admin/products
export const newProduct = async (req, res)=>{
    const product = await Product.create(req.body);

    res.status(200).json({product})
}

// get single product => /api/v1/products/:id
export const getProductDetails = async (req, res)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        res.status(400).json({
            error:"Product not found"
        })
    }else{
        res.status(200).json({product})
    }
    
}


// Update single product => /api/v1/products/:id
export const updateProduct = async (req, res)=>{
    let product = await Product.findById(req?.params?.id);

    if(!product){
        res.status(400).json({
            error:"Product not found"
        })
    }else{
        product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true})
        res.status(200).json({product})
    }
    
}

// Delete single product => /api/v1/products/:id
export const deleteProduct = async (req, res)=>{
    const product = await Product.findById(req?.params?.id);

    if(!product){
        res.status(400).json({
            error:"Product not found"
        })
    }else{
        await product.deleteOne()
        res.status(200).json({message:"Product deleted"})
    }
    
}