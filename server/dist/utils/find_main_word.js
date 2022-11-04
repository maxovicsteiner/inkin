"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find_main_word = void 0;
const binary_search_1 = require("./binary_search");
function find_main_word(array, word) {
    array = array.slice((0, binary_search_1.binary_search)(array, word, true), (0, binary_search_1.binary_search)(array, word, false) + 1); // O (log(n))
    let count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === word)
            count++;
        // O(p) where p is the length of an array of all words beginning with the letter of the target word
    }
    return [word, count];
}
exports.find_main_word = find_main_word;
