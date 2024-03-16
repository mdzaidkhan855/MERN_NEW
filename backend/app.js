import express from 'express';
const app = express();
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.js'


// handle uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(err);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
})




dotenv.config({path:'backend/config/config.env'});


// Connecting to database
import connectDatabase from './config/dbConnect.js'
connectDatabase();

app.use(express.json())
app.use(cookieParser())

//import all routes
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
app.use("/api/v1",productRoutes);
app.use("/api/v1",authRoutes);
app.use("/api/v1",orderRoutes);

// Use error middleware at the end
app.use(errorMiddleware);

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at : ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

// handle unhandled promised rejection
process.on('unhandledRejection',(err)=>{
    console.log(err);
    console.log('Shutting down server due to uhhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})