import { Router } from "express";

import { getPosts } from "../controllers/postsControllers";

const router = Router();

router.get("/", getPosts);

export default router;
