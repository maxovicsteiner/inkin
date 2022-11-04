import { Router } from "express";
import {
  registerUser,
  verifyEmailAddress,
  loginUser,
} from "../controllers/authControllers";

// API url = /api/auth
const router = Router();

router.post("/register", registerUser);
router.post("/verify/:uid", verifyEmailAddress);
router.post("/login", loginUser);

export default router;
