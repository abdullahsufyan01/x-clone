import mongoose from "mongoose";

const connectMongoDB = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected successfuly: ${connection.connection.host}`);
        
    } catch (error) {
        console.error(`MongoDb is not connected due to ${error.message}`);
        process.exit(1);
        
    }
}

export default connectMongoDB;