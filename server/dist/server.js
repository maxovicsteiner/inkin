"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const db_1 = __importDefault(require("./config/db"));
const routes_1 = require("./routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const cors_1 = __importDefault(require("cors"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to database
(0, db_1.default)();
app.listen(PORT, () => console.log(`[LISTENING] - Listening on port ${PORT}`));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
const BASE_URL = "/api";
app.use(BASE_URL + "/auth", routes_1.authRoutes);
// Protected routes
app.use(authMiddleware_1.protect);
app.use(BASE_URL + "/posts", routes_1.postRoutes);
// Error handler
app.use(errorHandler_1.errorHandler);
