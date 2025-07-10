import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`database connected! ${connect.connection.host}`);

    }catch(err){
        console.log(err)
        throw new Error("something went wrong", err)
        process.exit(1)
    }
}

