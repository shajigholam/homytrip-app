import express, {Request, Response} from "express";
import {param, validationResult} from "express-validator";
import Hotel from "../models/hotel";

const router = express.Router();

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Error fetching hotel"});
    }
  }
);
