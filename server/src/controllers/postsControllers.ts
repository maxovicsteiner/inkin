import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  // TODO: send posts according to user's taste

  res.send("Hello world");
});
