"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postsControllers_1 = require("../controllers/postsControllers");
const router = (0, express_1.Router)();
router.get("/", postsControllers_1.getPosts);
exports.default = router;
