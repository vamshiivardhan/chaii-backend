import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary, UploadStream } from "../utils/cloudinary.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRespond  } from '../utils/ApiRespond.js';



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


  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
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
    new ApiResponse(200,createdUser, "User registered Successfully")
  )


});  
export { registerUser };