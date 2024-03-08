import mongoose from "mongoose";
import Product from '../models/product.js'
import products from './data.js'

const seedproduct = async ()=>{

    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/shopit-v2");

        await Product.deleteMany();
        console.log("products deleted");
        await Product.insertMany(products);
        console.log("Produts added");
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedproduct();