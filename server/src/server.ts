import express from "express";
import { config } from "dotenv";
import connectToDB from "./config/db";
import { authRoutes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

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

// Error handler
app.use(errorHandler);
