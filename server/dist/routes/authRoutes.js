"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
// API url = /api/auth
const router = (0, express_1.Router)();
router.post("/register", authControllers_1.registerUser);
router.post("/verify/:uid", authControllers_1.verifyEmailAddress);
router.post("/login", authControllers_1.loginUser);
exports.default = router;
