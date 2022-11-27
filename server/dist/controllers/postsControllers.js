"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactWithPost = exports.createPost = exports.getPosts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const User_2 = require("../models/User");
exports.getPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: send posts according to user's taste
    // First step: get user from request
    const user = yield User_1.default.findById(req.user);
    if (!user) {
        res.status(401);
        throw new Error("Authorization error");
    }
    // Second step: Initialize posts array
    let posts = [];
    // Third step: Get posts by interest
    for (let i = 0; i < user.interests.length; i++) {
        let temp = yield Post_1.default.find({ main_word: user.interests[i] });
        posts = posts.concat(temp);
    }
    // Fourth step: Get posts by following
    for (let i = 0; i < user.following.length; i++) {
        let temp = yield Post_1.default.find({ author: user.following[i] });
        posts = posts.concat(temp);
    }
    res.status(200).json({ posts });
}));
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user from request
    const user = yield User_1.default.findById(req.user);
    if (!user) {
        res.status(401);
        throw new Error("Authorization error");
    }
    let text = req.body.text;
    text = text === null || text === void 0 ? void 0 : text.trim();
    if (!text) {
        res.status(400);
        throw new Error("You haven't written anything!");
    }
    const post = yield user.create_post(text); // Ignore warning
    res.status(201).json({ post });
}));
exports.interactWithPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user
    const user = yield User_1.default.findById(req.user);
    if (!user) {
        res.status(401);
        throw new Error("Authorization error");
    }
    // get post
    const post = yield Post_1.default.findById(req.params.puid);
    if (!post) {
        res.status(400);
        throw new Error("Post was not found");
    }
    yield user.interact(post, req.body.action_type === "0" ? User_2.Actions.Downvote : User_2.Actions.Upvote);
    res.status(200).json({ post });
}));
