import express, {Request, Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import {body} from "express-validator";
import {HotelType} from "../shared/types";

const router = express.Router();

//upload files to RAM, without writing them to the server's disk(multer helps parse that incoming file and makes it accessible in your req (request) object.)
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
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("descreption").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1. upload images to cloudinary
      const imageUrls = await uploadImages(imageFiles);

      //2. if upload was successful, add URLs to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; //***get the id attached to the req from the verifyToken

      //3. save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //4. return 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res.status(500).json({message: "something is wrong"});
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({userId: req.userId});
    res.json(hotels);
  } catch (error) {
    res.status(500).json({message: "Error fetching hotels"});
  }
});

// api/my-hotels/id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({_id: id, userId: req.userId});
    res.json(hotel);
  } catch (error) {
    res.status(500).json({message: "Error fetching hotel"});
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        {new: true}
      );

      if (!hotel) {
        return res.status(404).json({message: "Hotel not found"});
      }
      //upload to cloudinary
      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];
      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({message: "something went wrong"});
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async image => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  //wait for all images to get uploaded in cloudinary and receive the urls
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
