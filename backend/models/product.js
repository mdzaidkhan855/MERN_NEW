
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'enter product name'],
            maxLength:[200,'product name can not exceed 200 characters']
        },
        price:{
            type:Number,
            required:[true,'please enter product price'],
            maxLength:[5,'product price can not exceed 5 digits']
        },
        description:{
            type:String,
            required:[true,'enter product description'],
        },
        rating:{
            type:Number,
            default: 0
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
            }
        ],
        category:{
            type:String,
            required:[true,'enter product category'],
            enum:{
                values: [
                    'Electronics',
                    'Cameras',
                    'Laptops',
                    'Accessories',
                    'Headphones',
                    'Food',
                    "Books",
                    'Clothes/Shoes',
                    'Beauty/Health',
                    'Sports',
                    'Outdoor',
                    'Home'
                ],
                message:'Please select correct category'
            }
        },
        seller: {
            type: String,
            required: [true, 'Please enter product seller']
        },
        stock: {
            type: Number,
            required: [true, 'Please enter product stock'],
            maxLength: [5, 'Product name cannot exceed 5 characters'],
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {timestamps:true}
)

export default mongoose.model("Product",productSchema)