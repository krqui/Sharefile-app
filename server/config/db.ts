// truco para typescritp: ctrl + spacebar
// ! because that variable can be undefined.
import mongoose from "mongoose";
//let useCreateIndex:boolean
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
        });
    } catch (error:unknown) {
        console.log("Connection Error ",error);

    }

    const connection = mongoose.connection;
    if (connection.readyState >=1) {
        console.log("connected to database");
    }
    connection.on("error", ()=> console.log("connection failed"))
}

export default connectDB;