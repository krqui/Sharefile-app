// before coding:
// cd server: npm init -y
// npm i express cors dotenv && npm i -D typescript tsc ts-node-dev @types/express @types/node @types/cors
// cd server: tsc --init
// setting backend:
// cd server: npm i multer cloudinary && npm i -D @types/multer
// ↑ cloudinary comes with TS, but Multa doesn't
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import fileRoute from "./routes/files";
import {v2 as cloudinary} from 'cloudinary';
const app= express();
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_API_CLOUD,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
connectDB()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));

app.use("/api/files",fileRoute)

const PORT=process.env.PORT;

app.listen(PORT, ()=>console.log(`Server is listening on PORT ${PORT}`));
// 32:35