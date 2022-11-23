import express from "express";
import { config } from "dotenv";
import connectToDB from "./config/db";
import { authRoutes, postRoutes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import { protect } from "./middlewares/authMiddleware";

config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to database
connectToDB();

app.listen(PORT, () => console.log(`[LISTENING] - Listening on port ${PORT}`));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const BASE_URL = "/api";

app.use(BASE_URL + "/auth", authRoutes);

// Protected routes
app.use(protect);
app.use(BASE_URL + "/posts", postRoutes);

// Error handler
app.use(errorHandler);
