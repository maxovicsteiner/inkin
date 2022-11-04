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
exports.Actions = void 0;
const mongoose_1 = require("mongoose");
const Post_1 = __importDefault(require("./Post"));
var Actions;
(function (Actions) {
    Actions[Actions["Upvote"] = 0] = "Upvote";
    Actions[Actions["Downvote"] = 1] = "Downvote";
})(Actions = exports.Actions || (exports.Actions = {}));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    points: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
userSchema.methods.follow = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            user.points += 10;
            yield user.save();
            let following = new Set(this.following);
            if (following.has(user._id.toString())) {
                // O(1)
                following.delete(user._id.toString()); // If already following user, remove from the following array...
            }
            let temp = [...following]; // O(n)
            temp.unshift(user._id.toString()); // ...and add them to the beginning // O(n)
            if (temp.length > 10) {
                temp.pop(); // No longer intersted in the last following... remove them (first in first out)  // O(1)
            }
            this.following = temp;
            yield this.save();
        }
        catch (error) {
            console.log(error);
        }
    });
};
userSchema.methods.create_post = function (text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield Post_1.default.create({ author: this._id, text });
            if (post) {
                this.points += 20;
                yield this.save();
                return post;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    });
};
userSchema.methods.interact = function (post, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const author = yield this.model("User").findById(post.author);
            if (action === Actions.Downvote) {
                post.likes--;
                author.points -= 5;
            }
            else if (action === Actions.Upvote) {
                post.likes++;
                author.points += 5;
                if (post.main_word) {
                    let interests = new Set(this.interests);
                    if (interests.has(post.main_word)) {
                        interests.delete(post.main_word);
                    }
                    let temp = [...interests];
                    temp.unshift(post.main_word);
                    if (temp.length > 5) {
                        temp.pop();
                    }
                    this.interests = temp;
                }
            }
            yield post.save();
            yield author.save();
            yield this.save();
        }
        catch (error) {
            console.log(error.message);
        }
    });
};
userSchema.methods.not_interested = function (post) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (post.main_word) {
                let interests = new Set(this.interests);
                let following = new Set(this.following);
                if (interests.has(post.main_word)) {
                    interests.delete(post.main_word);
                }
                if (following.has(post.author.toString())) {
                    following.delete(post.author.toString());
                }
                let temp1 = [...interests];
                let temp2 = [...following];
                this.interests = temp1;
                this.following = temp2;
                yield this.save();
            }
        }
        catch (error) {
            console.log(error.message);
        }
    });
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
