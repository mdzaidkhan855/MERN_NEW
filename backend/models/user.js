
import mongoose from "mongoose";
//import  validator from 'validator';
import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, 'Please enter your name'],
            maxLength: [30, 'Your name cannot exceed 30 characters']
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            //validate: [validator.isEmail, 'Please enter valid email address']
        },
        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minlength: [6, 'Your password must be longer than 6 characters'],
            select: false
        },
        avatar: {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        },
        role: {
            type: String,
            default: 'user'
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {timestamps:true}
)

// Encrypting password before saving user
userSchema.pre('save', async function(next){
    console.log("###### Pre Save method being called ############");
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    console.log("###### The password encrypted is: " + this.password);
});

// Return JWT Token
userSchema.methods.getJwtToken = function(){
    console.log("###### Creating Token in User Schema ############");
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 30*60 * 1000;

    return resetToken;
}

export default mongoose.model('User',userSchema);