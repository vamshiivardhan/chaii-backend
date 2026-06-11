// import mongoose from 'mongoose';
// import { DB_NAME } from "./constants.js";



// /*
// import express from 'express';

// const app = express();




// ( async () => {
// try {
//     await mongoose.connect(`${process.env. MONGODB_URL}/${DB_name}`)
//     app.on("error", (err) => {
//         console.error("Error: ", err);
//         throw err;
//     }
//     )

// }

// catch(error){
//     console.error("Error: ", error);
//     throw error;

// }
// })();

// */
import mongoose from "mongoose";
 import { DB_NAME } from "./constants.js";
 import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});





const connectDB = async () => {
    try {
        console.log("MONGO_URI =", process.env.MONGO_URI);

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );

        console.log(
            `MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
connectDB() 

.then( () => {
    app.listen(process.env.PORT ||8000, () => {
        console.log(`⚙️ Server is running on port ${process.env.PORT || 8000}`)
    })
    console.log("MONGO db connected successfully !!")
})

.catch((error) => {
    console.log("MONGO db concection failed !!", error);
});

export default connectDB; 