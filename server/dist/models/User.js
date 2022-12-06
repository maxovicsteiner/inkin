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
const INTEREST_ARRAY_LENGTH = 5;
const FOLLOWING_ARRAY_LENGTH = 10;
var Actions;
(function (Actions) {
    Actions[Actions["Downvote"] = 0] = "Downvote";
    Actions[Actions["Upvote"] = 1] = "Upvote";
    Actions[Actions["Favorite"] = 2] = "Favorite";
    Actions[Actions["Undo"] = 3] = "Undo";
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
    favorite_posts: {
        type: [mongoose_1.Schema.Types.ObjectId],
        default: [],
    },
    followers: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        let points = 0;
        const posts = yield Post_1.default.find({ author: this._id.toString() });
        posts.forEach((post) => {
            // add 5 points for every like
            // substract 5 points for every dislike
            // add 5 points for every favorite
            points +=
                (post.interacted[Actions.Upvote].length +
                    post.interacted[Actions.Favorite].length) *
                    5 -
                    post.interacted[Actions.Downvote].length * 5;
        });
        // add 10 points for every follow
        points += this.followers * 10;
        this.points = points;
    });
});
userSchema.methods.follow = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            user.followers += 1;
            yield user.save();
            let following = new Set(this.following);
            if (following.has(user._id.toString())) {
                // O(1)
                following.delete(user._id.toString()); // If already following user, remove from the following array...
            }
            let temp = [...following]; // O(n)
            temp.unshift(user._id.toString()); // ...and add them to the beginning // O(n)
            if (temp.length > FOLLOWING_ARRAY_LENGTH) {
                let id = temp.pop(); // No longer intersted in the last following... remove them (first in first out)  // O(1)
                const author = yield this.model("User").findById(id);
                author.followers -= 1;
                yield author.save();
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
                if (post.main_word) {
                    let interests = new Set(this.interests);
                    if (interests.has(post.main_word)) {
                        interests.delete(post.main_word);
                    }
                    let temp = [...interests];
                    temp.unshift(post.main_word);
                    if (temp.length > INTEREST_ARRAY_LENGTH) {
                        temp.pop();
                    }
                    this.interests = temp;
                }
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
userSchema.methods.interact = function (post, action, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const author = yield this.model("User").findById(post.author);
            switch (+action // Conversion from string to numbers https://stackoverflow.com/questions/27747437/typescript-enum-switch-not-working
            ) {
                case Actions.Downvote:
                    for (let i = 0; i < post.interacted[Actions.Downvote].length; i++) {
                        if (post.interacted[Actions.Downvote][i] == this._id.toString()) {
                            return;
                        }
                    }
                    post.interacted = [
                        [...post.interacted[Actions.Downvote], this._id.toString()],
                        [
                            ...post.interacted[Actions.Upvote].filter((user) => user != this._id.toString()),
                        ],
                        [...post.interacted[Actions.Favorite]],
                    ];
                    break;
                case Actions.Upvote:
                    for (let i = 0; i < post.interacted[Actions.Upvote].length; i++) {
                        if (post.interacted[Actions.Upvote][i] == this._id.toString()) {
                            return;
                        }
                    }
                    post.interacted = [
                        [
                            ...post.interacted[Actions.Downvote].filter((user) => user != this._id.toString()),
                        ],
                        [...post.interacted[Actions.Upvote], this._id.toString()],
                        [...post.interacted[Actions.Favorite]],
                    ];
                    if (post.main_word) {
                        let interests = new Set(this.interests);
                        if (interests.has(post.main_word)) {
                            interests.delete(post.main_word);
                        }
                        let temp = [...interests];
                        temp.unshift(post.main_word);
                        if (temp.length > INTEREST_ARRAY_LENGTH) {
                            temp.pop();
                        }
                        this.interests = temp;
                    }
                    break;
                case Actions.Favorite:
                    let added_to_favorites = false;
                    if (this.favorite_posts.length < post.interacted[Actions.Favorite].length) {
                        user_loop: for (let i = 0; i < this.favorite_posts.length; i++) {
                            if (post._id.toString() == this.favorite_posts[i]) {
                                added_to_favorites = true;
                                break user_loop;
                            }
                        }
                    }
                    else {
                        post_loop: for (let i = 0; i < post.interacted[Actions.Favorite].length; i++) {
                            if (post.interacted[Actions.Favorite][i] == this._id.toString()) {
                                added_to_favorites = true;
                                break post_loop;
                            }
                        }
                    }
                    if (added_to_favorites) {
                        break;
                    }
                    this.favorite_posts = [...this.favorite_posts, post._id.toString()];
                    post.interacted = [
                        [...post.interacted[Actions.Downvote]],
                        [...post.interacted[Actions.Upvote]],
                        [...post.interacted[Actions.Favorite], this._id.toString()],
                    ];
                    break;
                case Actions.Undo:
                    // Remove like/dislike/favorite
                    if (options === Actions.Favorite) {
                        post.interacted = [
                            [...post.interacted[Actions.Downvote]],
                            [...post.interacted[Actions.Upvote]],
                            [
                                ...post.interacted[Actions.Favorite].filter((user) => user.toString() != this._id.toString()),
                            ],
                        ];
                        for (let i = 0; i < this.favorite_posts.length; i++) {
                            if (this.favorite_posts[i] == post._id.toString()) {
                                this.favorite_posts.splice(i, 1);
                            }
                        }
                    }
                    else {
                        post.interacted = [
                            [
                                ...post.interacted[Actions.Downvote].filter((user) => user != this._id.toString()),
                            ],
                            [
                                ...post.interacted[Actions.Upvote].filter((user) => user != this._id.toString()),
                            ],
                            [...post.interacted[Actions.Favorite]],
                        ];
                    }
                    break;
            }
            post.likes =
                post.interacted[Actions.Upvote].length -
                    post.interacted[Actions.Downvote].length;
            post.favorites = post.interacted[Actions.Favorite].length;
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
