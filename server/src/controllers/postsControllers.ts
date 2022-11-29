import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import { Actions } from "../models/User";

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  // TODO: send posts according to user's taste

  // First step: get user from request
  const user = await User.findById(req.user);

  if (!user) {
    res.status(401);
    throw new Error("Authorization error");
  }

  // Second step: Initialize posts array
  let posts: typeof Post[] = [];

  // Third step: Get posts by interest
  for (let i = 0; i < user.interests.length; i++) {
    let temp: typeof Post[] = await Post.find({ main_word: user.interests[i] });
    posts = posts.concat(temp);
  }

  // Fourth step: Get posts by following
  for (let i = 0; i < user.following.length; i++) {
    let temp: typeof Post[] = await Post.find({ author: user.following[i] });
    posts = posts.concat(temp);
  }

  res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  // get the user from request
  const user = await User.findById(req.user);

  if (!user) {
    res.status(401);
    throw new Error("Authorization error");
  }

  let text = req.body.text;

  text = text?.trim();

  if (!text) {
    res.status(400);
    throw new Error("You haven't written anything!");
  }

  const post = await user.create_post(text); // Ignore warning

  res.status(201).json({ post });
});

export const interactWithPost = asyncHandler(
  async (req: Request, res: Response) => {
    // get user
    const user = await User.findById(req.user);

    if (!user) {
      res.status(401);
      throw new Error("Authorization error");
    }

    // get post
    const post = await Post.findById(req.params.puid);

    if (!post) {
      res.status(400);
      throw new Error("Post was not found");
    }

    switch (req.body.action_type) {
      case "0":
        // Downvote
        await user.interact(post, Actions.Downvote);
        break;
      case "1":
        // Upvote
        await user.interact(post, Actions.Upvote);
        break;
      case "-1":
        // Undo actions
        await user.interact(post, Actions.Undo);
        break;
      default:
        res.status(400);
        throw new Error("An error happened");
        break;
    }

    res.status(200).json({ post });
  }
);
