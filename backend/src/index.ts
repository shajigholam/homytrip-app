import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import {v2 as cloudinary} from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";

// configure the cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
// .then(() =>
//   console.log("Connected to db: ", process.env.MONGODB_CONNECTION_STRING)
// );

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8000;

//  Middleware processes incoming requests before they reach your route handlers.
app.use(express.json()); // convert the body of API requests to json
app.use(express.urlencoded({extended: true}));
// our server is only going to accept req from this URL and that URL must include the credintials and http cookies in the req
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Serve frontend build folder from the backend
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);

// start server
app.listen(port, () => {
  console.log(`server is running on localhost: ${port}`);
});
