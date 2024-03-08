import ErrorHandler from "../utils/errorHandler.js"

export default (err, req, res, next) =>{

    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server error"
    }

    // Handle Invalid mongoose ID error
    if(err.name === 'CastError'){
        const message = `Resource Not Found: ${err?.path}`;
        error = new ErrorHandler(message, 404);
    }

    // Handle Validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map((value)=> value.message)
        error = new ErrorHandler(message, 400);
    }

    if(process.env.NODE_ENV === 'DEVELOPMENT') {

        res.status(error.statusCode).json({
            message:error.message,
            error:err,
            stack:err?.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        
        res.status(error.statusCode).json({
            message:error.message
        })
    }

   
}