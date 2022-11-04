import { binary_search } from "./binary_search";

export function find_main_word(
  array: string[],
  word: string
): [string, number] {
  array = array.slice(
    binary_search(array, word, true),
    binary_search(array, word, false) + 1
  ); // O (log(n))

  let count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === word) count++;
    // O(p) where p is the length of an array of all words beginning with the letter of the target word
  }

  return [word, count];
}
