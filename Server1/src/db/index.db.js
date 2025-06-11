// db/index.db.js
import mongoose from "mongoose";

const connectDB = async () =>{
    try {
     const data = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
     console.log("db connected.", data.connection.host);
    } 
    catch(error){
        console.error("Error connecting to database:", error.message);
        console.error("Error stack:", error.stack);
        process.exit(1);
    }
}

export default connectDB