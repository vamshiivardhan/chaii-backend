// import {v2 as cloudinary } from 'cloudinary';
// import fs from "fs";
 

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
//     api_key: process.env.CLOUDINARY_API_KEY ,
//     api_secret: process.env.CLOUDINARY_API_SECRET

// });

// const uploadOnCloudinary = async (filePath) => {  
//      try{
//         if( !filePath) return null;
//         // Upload the file to Cloudinary
//       // const result = await cloudinary.v2.uploader.upload(filePath);
//       const result = await cloudinary.uploader.upload(filePath);
//         return result;
//         console.log("Upload successful:", result);

//         return response;
//         // console.log("Upload successful:", result);
//         // return result;

//     } catch (error) { 

//         fs.unlinkSync(filePath)
//         // remove the locally saved temporary file is deleted after upload to cloudinary
//         return null;



//     } 
//     };

//     export{ uploadOnCloudinary  }





// // cloudinary.uploader.upload(
// //   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
// //   function (error, result) {
// //     console.log(result, error);
// //   }
// // );








// export default cloudinary;
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath,{
            resource_type: "auto "
        }
        ) 
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}