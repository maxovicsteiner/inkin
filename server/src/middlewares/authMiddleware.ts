import asyncHandler from "express-async-handler";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check for token
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user._id.toString();
          next();
        } else {
          res.status(403);
          throw new Error("Unauthorized, user not found");
        }
      } else {
        res.status(403);
        throw new Error("Unauthorized, invalid jwt");
      }
    } else {
      res.status(403);
      throw new Error("Unauthorized, no token");
    }
  }
);
