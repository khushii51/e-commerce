import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Scuccessfully!");
        
        
    } catch (error) {
        console.log("Database Connection Error!", error);
        
    }
}
export default connectDB;