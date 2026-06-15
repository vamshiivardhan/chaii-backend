import mongoose , { Schema }from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

 
const userSchema = new Schema({ 

 username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
},
email: {
    type: String,
    required: true,
    unique: true,
    trim: true,

},
fullName: {
    type: String,
    required: true,
    trim: true
},
password: {
    type: String,
    required: [true, 'Password is required']
},
avatar:{
    type: String,
    trim: true
},
coverImage:{
    type: String,
    trim: true
},
watchHistory: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Video'
}
],
refreshToken: {
    type: String,
    trim: true
},
// createdAt: {
//     type: Date,
//     default: Date.now

// },updatedAt: {
//     type: Date,
//     default: Date.now
// }

}
, { timestamps: true });
 



userSchema.pre('save', async function () {
    if(!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
    {
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
        avatar: this.avatar,

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    }

)
}
userSchema.methods.generateRefreshToken = function () {
     return jwt.sign(
    {
        _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    }

)

} 

export const User = mongoose.model('User', userSchema)
