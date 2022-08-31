import { Router } from "express";
import multer from "multer";
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import File from "../models/File";
const router = Router()
const storage = multer.diskStorage({});

let upload = multer({
    storage
})
router.post("/upload", upload.single("myFile"), async (req,res)=>{
    try {
        if (!req.file) return res.status(400).json({message:"Hey bro! We need the file."})
        console.log(req.file);

        let uploadedFile:UploadApiResponse;
        try {
            uploadedFile=await cloudinary.uploader.upload(req.file.path, {
                folder:"sharemeYT",
                resource_type:"auto"//tiene que ser auto para que acepte todo tipo de dato
            })
        } catch (error:any) {
            console.log(error.message);
            return res.status(400).json({message:"Cloudinary Error"});
        }
        const {originalname } = req.file;
        const {secure_url, bytes, format} = uploadedFile;

        const file= await File.create({
            filename:originalname,
            sizeInBytes:bytes,
            secure_url,
            format,
        });
        //res.status(200).json(file);
        res.status(200).json({
            id:file._id, // that's how mongoose creates the id
            downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`
        })
    } catch (error:any) {
        console.log(error.message);
        res.status(500).json({message:"Server Error :("});
    }
});

export default router;