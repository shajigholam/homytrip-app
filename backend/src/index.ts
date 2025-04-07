import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
const port = process.env.PORT || 8000;

//  Middleware processes incoming requests before they reach your route handlers.
app.use(express.json()); // convert the body of API requests to json
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/api/test", (req: Request, res:Response) => {
    res.json({ message: "hello from express endpoint!"});
});

// start server
app.listen(port, () => {
    console.log(`server is running on localhost: ${port}`);
});