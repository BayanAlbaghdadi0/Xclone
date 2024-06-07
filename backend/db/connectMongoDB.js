import mongoose from "mongoose";

 const connectMongoDB = async () => {
  try {
    
   const con= await mongoose.connect(process.env.MONGO_URL);
   console.log(`MONGOOSE ISCONNECTED ${con.connection.host}`);
  } catch (error) {
    console.error(`error connecting to Mongoose :${error.message}`);
    process.exit(1);
  }
};
export default connectMongoDB;
