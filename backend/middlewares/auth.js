

// check if user is authenticated

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js"
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Login first to access resource", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    console.log(" Authenticated USer : ", req.user);
    next();
})

// Authorize user roles
export const authorizeRoles = (...roles)=>{
    console.log(" The roles for authorization is :" + roles);
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Rloes (${req.user.role}) is not allowed to access this resource`, 403)) 
        }
        next();
    }
}