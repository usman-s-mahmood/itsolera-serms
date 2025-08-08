import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`Connected To Mongo DB`);
    } catch (error) {
        console.log(`Error Connecting To MongoDB: ${error}`);
    }
}

export default mongoConnection;