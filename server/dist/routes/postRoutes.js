"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postsControllers_1 = require("../controllers/postsControllers");
const router = (0, express_1.Router)();
router.route("/").get(postsControllers_1.getPosts).post(postsControllers_1.createPost);
router.route("/:puid").post(postsControllers_1.interactWithPost);
exports.default = router;
