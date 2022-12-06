import { Router } from "express";

import {
  createPost,
  getPosts,
  interactWithPost,
  postDetails,
} from "../controllers/postsControllers";

const router = Router();

router.route("/").get(getPosts).post(createPost);

router.route("/:puid").get(postDetails).post(interactWithPost);

export default router;
