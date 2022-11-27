import { Router } from "express";

import {
  createPost,
  getPosts,
  interactWithPost,
} from "../controllers/postsControllers";

const router = Router();

router.route("/").get(getPosts).post(createPost);

router.route("/:puid").post(interactWithPost);

export default router;
