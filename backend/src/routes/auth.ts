import express, {Request, Response} from "express";
import User from "../models/user";
import {check, validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.array()});
    }

    const {email, password} = req.body;
    try {
      const user = await User.findOne({email});
      if (!user) {
        return res.status(400).send({message: "invalid email or password"});
      }
      // compare the encrypted passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({message: "invalid email or password"});
      }
      // create jwt token, userid -> payload
      const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: "1d"}
      );
      // server sets token as cookie (with httpOnly, we don't let JS to access the token and log it to the console)
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      // return back the user id as the client and the front end doesn't have access to it coz they don't have access to token in this case
      res.status(200).json({userId: user._id});
    } catch (error) {
      console.log(error);
      res.status(500).send({message: "something went wrong"});
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({userId: req.userId});
});

export default router;

/**
[ AppContext / App.tsx ]
     ↓
useQuery(validateToken)
     ↓
[ api-client.ts ]
     ↓
fetch /api/auth/validate-token
     ↓
[ Express route: auth.ts ]
     ↓
verifyToken middleware (middleware/auth.ts)
     ↓
If valid, attaches userId and continues
     ↓
Response sent { userId }
     ↓
useQuery receives data / sets error
     ↓
Context sets isLoggedIn

 */
