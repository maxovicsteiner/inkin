"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
// this is temporary - Load from https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt
var Interest;
(function (Interest) {
    Interest[Interest["Suicide"] = 0] = "Suicide";
    Interest[Interest["Ed"] = 1] = "Ed";
    Interest[Interest["Sh"] = 2] = "Sh";
    Interest[Interest["Bipolar"] = 3] = "Bipolar";
    Interest[Interest["Disorder"] = 4] = "Disorder";
    Interest[Interest["Eating"] = 5] = "Eating";
    Interest[Interest["Crisis"] = 6] = "Crisis";
})(Interest || (Interest = {}));
const postSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    main_word: {
        type: String,
        default: null,
    },
    likes: {
        type: Number,
        default: 0,
    },
    configured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
postSchema.pre("save", function () {
    if (this.configured)
        return;
    let array = this.text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(" ");
    (0, utils_1.merge_sort)(array);
    const map = new Map([]);
    for (let i = 0; i < Object.keys(Interest).length; i++) {
        let current_target = Object.keys(Interest)[i].toLowerCase();
        let result = (0, utils_1.find_main_word)(array, current_target);
        if (result[1] > 0) {
            map.set(...result);
        }
    }
    let theme = null;
    let occurrences = 0;
    map.forEach((value, key) => {
        if (value >= occurrences) {
            theme = key;
            occurrences = value;
        }
    });
    this.main_word = theme;
    this.configured = true;
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
