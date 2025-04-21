import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

//TypeScript, when I'm using express.Request, just know it might have a userId property too.
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  //using cookie-parser
  const token = req.cookies["auth_token"];

  if (!token) {
    return res.status(401).json({message: "unauthorized"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId; // decoded is: string | JwtPayload here is JwtPayload coz before we did jwt.sign({ userId: "abc123" },
    next();
  } catch (error) {
    return res.status(401).json({message: "unauthorized"});
  }
};

export default verifyToken;

/**
 * When the user logs in, the server sets the cookie in auth.ts in route
 * Every time the browser sends another request, it automatically includes this cookie in the request headers
 * we use cookie-parser middleware (npm install cookie-parser) parses that cookie from the headers and adds it to req.cookies
 */

/*
flow:
User logs in → token stored in cookie.
Later, frontend calls /validate-token.
verifyToken checks the cookie token.
If valid → responds with userId.
If not → responds with 401 Unauthorized.
*/
