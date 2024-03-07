import express from 'express';
const app = express();
import dotenv from "dotenv";

dotenv.config({path:'backend/config/config.env'});


// Connecting to database
import connectDatabase from './config/dbConnect.js'
connectDatabase();

//import all routes
import productRoutes from './routes/products.js';
app.use("/api/v1",productRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running at : ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})