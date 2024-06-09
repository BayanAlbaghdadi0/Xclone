import express from "express";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log(process.env.MONGO_URL);

const app = express();

const PORT = process.env.PORT || 5000;

//
app.use(express.json());
app.use(cookieParser());
//
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// app.get('/', (req, res) => {
//   res.send('welcome in my  Express!');
// });

app.listen(PORT, () => {
  console.log(`  srever runing in ... http://localhost:${PORT}`);
  connectMongoDB();
});
