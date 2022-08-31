import { Schema, Document, model } from "mongoose";

const fileSchema = new Schema({
    filename:{
        type:String,
        required:true
    },
    secure_url:{
        type:String,
        required:true
    },
    format:{
        type:String,
        required:true
    },
    sizeInBytes:{
        type:String,
        required:true
    },
    sender: {
        type:String
    },
    receiver: {
        type:String
    },
}, {
    timestamps:true,
});

interface IFile extends Document {
    // question mark means that is optional.
    filename: string;
    secure_url: string;
    sizeInBytes:string;
    format: string;
    sender?: string;
    receiver?:string
}

export default model<IFile>("File",fileSchema)