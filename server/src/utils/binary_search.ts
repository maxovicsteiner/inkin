// This is a tweaked form of the binary search algorithm
// Lowest occurence of a number in a sorted array

export function binary_search(
  sorted_array: string[],
  target: string,
  searchFirst: boolean
): number {
  var left: number = 0;
  var right: number = sorted_array.length - 1;
  var result: number = -1;

  while (left <= right) {
    var middle: number = Math.ceil((left + right) / 2);
    if (sorted_array[middle][0] === target[0]) {
      result = middle;
      searchFirst
        ? (right = middle - 1) // For lowest occurence
        : (left = middle + 1); // For highest occurence
    } else if (sorted_array[middle].charCodeAt(0) > target.charCodeAt(0)) {
      right = middle - 1;
    } else {
      left = middle + 1;
    }
  }

  // If target not found
  return result;
}
