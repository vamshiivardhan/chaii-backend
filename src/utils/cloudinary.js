import {v2 as cloudinary } from 'cloudinary';
 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary = async (filePath) => {  
     try{
        if( !filePath) return null;
        // Upload the file to Cloudinary
      const result = await cloudinary.v2.uploader.upload(filePath);
        return result;
        console.log("Upload successful:", result);
        return response;

    } catch (error) { 

        fs.unlinkSync(filePath)
        // remove the locally saved temporary file is deleted after upload to cloudinary
        return null;



    } 
    };

    export{ uploadOnCloudinary  }





        cloudinary.v2.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  function (error, result) {
    console.log(result, error);
  }
);








export default cloudinary;