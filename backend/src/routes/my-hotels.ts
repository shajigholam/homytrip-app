import express, {Request, Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

//upload files to RAM, without writing them to the server's disk
const storage = multer.memoryStorage();
// initialize multer and then use it as a middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

// api/my-hotels
router.post(
  "/",
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel = req.body;
      //1. upload images to cloudinary
      const uploadPromises = imageFiles.map(async image => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      //wait for all images to get uploaded
      const imageUrls = await Promise.all(uploadPromises);

      //2. if upload was successful, add URLs to the new hotel

      //3. save the new hotel in our database
      //4. return 201 status
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res.status(500).json({message: "something is wrong"});
    }
  }
);
