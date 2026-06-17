// import asyncHandler from '../utils/asyncHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary, UploadStream } from "../utils/cloudinary.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRespond  } from '../utils/ApiRespond.js';
import { application } from 'express';

const generateAccessAndRefreshTokens = async(userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
       await user.save({ validateBeforeSave:false })

       return { accessToken  , refreshToken }
    
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token for the apis ")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    
    // get user detals from frontend
     // validation  (see if user has sent empty ,validate email etc)
     //check if user already exist:username,email
     //check for images ,check for avatar
     //upload them to cloudnary
     //create user object - create entry in db
     //remove password and refresh token filed from response
      // check for user creation
      // return response




     const {fullName,email,username,password} = req.body
     console.log("BODY:", req.body);
     console.log("FILES:", req.files);
     console.log("email", email);


    //  if(fullName === ""){
    //     throw new ApiError(400,"fullname is required")
    //  }

    if(
        [fullName,password,email,fullName].some((field) =>
        field?.trim() === "")
    ){
          throw new ApiError(400,"All fields are compulsory and required ")

    }



    User.findOne({
        $or:[ { username } , { email }]

    })
     
    const existedUser = await User.findOne({
  $or: [{ username }, { email }]
});

if (existedUser) {
  throw new ApiError(
    409,
    "User with email or Username already exist"
  );
}

const avatarLocalPath = req.files?.avatar?.[0]?.path;

// const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

let coverImageLocalPath;

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
    coverImageLocalPath = req.files.coverImage[0].path 
     
}
  

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar files is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
        throw new ApiError(400,"Avatar files is required")
  }

 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })
    
  const createdUser  = await User.findById(user.id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")

  }
  return res.status(201).json(
	    new ApiRespond(200,createdUser, "User registered Successfully")
  )


});  


const loginUser = asyncHandler(async(req, res) => {
    //req body se data le avo
    //find the user
    //password check
    //access and refresh
    //send cookies
    const {email , username, password} = req.body


        if (!(username || email)) {
        throw new ApiError(400 ,"username or email is required")
    }

    // const user = await user.findOne({
    //     // see data base is in different continent it would take time
    //     $or:[{username} ,{email }]
    //  })
    const user = await User.findOne({
    $or: [{ username }, { email }]
})


     if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect
    (password)


     if(!isPasswordValid){
        throw new ApiError(401 ,"Invalid user credentials")

    }

    const { accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken ")
   
   const options  = {
    httpOnly:true,
    secure:true
   }
    
   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiRespond(
        200,
        {
            user: loggedInUser , accessToken, refreshToken 
        },
        "User logged in successfully"
    )
   )
   })


   const logoutUser = asyncHandler(async(req,res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiRespond(
                200,
                {},
                "User logged out successfully"
            )
        )

})


 const refreshAccessToken = asyncHandler(async(req,res)=>
{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    
 try {
     const decodedToken = jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     )
   
    const user = await User.findById(decodedToken?._id)
   
    if(!user){
           throw new ApiError(401,"Invalid refresh token")
       }
   
       if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
   
       }
       const options = {
           httpOnly: true,
           secure: true
       }
   
     const {accessToken, newRefreshToken} = await  generateAccessAndRefreshTokens(user._id)
   
     return res 
     .status(200)
     .cookie("accessToken",accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
       new ApiResponse(
           200,
           {accessToken,refreshToken: newRefreshToken},
           "Access token refreshed"
       )
     )
 } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid refresh token"
    )
    
 }

})






export { registerUser, loginUser, logoutUser, refreshAccessToken };
