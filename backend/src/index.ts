import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./routes/users";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
const port = process.env.PORT || 8000;

//  Middleware processes incoming requests before they reach your route handlers.
app.use(express.json()); // convert the body of API requests to json
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api/users", userRouter);

// start server
app.listen(port, () => {
  console.log(`server is running on localhost: ${port}`);
});
