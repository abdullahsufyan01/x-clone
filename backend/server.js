import express from "express";
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from "./db/conncetMongoDB.js";

dotenv.config()

const port  = process.env.PORT || 8000;
const app = express()
// console.log(process.env.MONGO_URL);


// auth api 
app.use("/api/auth",authRoutes)

app.listen(port , ()=>{
    console.log(`app is runnig on port ${port}`);
    connectMongoDB();
})