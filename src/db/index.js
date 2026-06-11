import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import connectDB from "./db/index.js";  

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}` 
        );

        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("Error connection FAILED:", error);
        process.exit(1);
    }
};

export default connectDB;



