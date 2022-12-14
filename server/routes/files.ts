import { Router } from "express";
import multer from "multer";
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import File from "../models/File";
import https from "https";
import nodemailer from 'nodemailer';
import createEmailTemplate from "../utils/createEmailTemplate";
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

router.get("/:id",async(req,res)=>{
    try {
        const id=req.params.id
        const file= await File.findById(id)
        if(!file){
            return res.status(404).json({message:"File does not exist"})
        }

        const {filename,format,sizeInBytes}=file
        return res.status(200).json({
            name:filename,
            sizeInBytes,
            format,
            id,
        });
    } catch (error) {
        return res.status(500).json({message:"Server Error :("})
    }
})

router.get("/:id/download",async(req,res)=>{
    try {
        const id=req.params.id
        const file= await File.findById(id)
        if(!file){
            return res.status(404).json({message:"File does not exist"})
        }

        https.get(file.secure_url, (fileStream)=> fileStream.pipe(res))
        //example for pipe:
        // const myBee= applyTax(toUpperCaseName(sort(bees))); bees es un array, eso solo es por el sort.
        // console.log(myBee) es igual a ...
        // const myBee2= pipe(sort,toUpperCaseName,applyTax)(bees);
        // console.log(myBee2)
    } catch (error) {
        return res.status(500).json({message:"Server Error :("})
    }
})

router.post("/email", async (req,res)=>{
    // 1. validar request
    const {id, emailFrom,emailTo} = req.body
    // 2. check if the file exists
    const file= await File.findById(id)
    if(!file){
        return res.status(404).json({message:"File does not exist"})
    }
    // 3. create transporter
    let transporter = nodemailer.createTransport({
        // @ts-ignore
        host:process.env.SENDINBLUE_SMTP_HOST,
        port:process.env.SENDINBLUE_SMTP_PORT,
        secure:false,
        auth: {
            user: process.env.SENDINBLUE_SMTP_USER,
            pass: process.env.SENDINBLUE_SMTP_PASSWORD,
        }
    });// arriba coment?? ignorar typescript, pues en node_modules/@types/nodemailer/lib/smtp-connection/index.d.ts no hay propiedades llamadas host,port, etc.

    // 4. prepare the e-mail data
    const {filename, sizeInBytes} = file;
    const fileSize = `${(Number(sizeInBytes)/(1024*1024)).toFixed(2)} MB`;
    const downloadPageLink= `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`
    const mailOptions = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "File Shared with you", // Subject line
        text: `${emailFrom} shared a file with you`, // plain text body
        html: createEmailTemplate(emailFrom, downloadPageLink,filename,fileSize), // html body
    }
    // 5. send mail using the transporter
    transporter.sendMail(mailOptions,async (error,info)=> {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message:"server error :("
            });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;

        await file.save();
        return res.status(200).json({
            message:"Email sent."
        });
    })
    // 6. save the data and send the response
// 2:32:30
})

export default router;