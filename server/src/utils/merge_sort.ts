export function merge_sort(array: string[]) {
  if (array.length === 1) {
    return;
  }
  var left_arr = array.slice(0, Math.ceil(array.length / 2));
  var right_arr = array.slice(Math.ceil(array.length / 2), array.length);
  merge_sort(left_arr);
  merge_sort(right_arr);
  var i: number = 0;
  var j: number = 0;
  var k: number = 0;
  while (i < left_arr.length && j < right_arr.length) {
    if (left_arr[i].charCodeAt(0) <= right_arr[j].charCodeAt(0)) {
      array[k] = left_arr[i];
      i++;
    } else {
      array[k] = right_arr[j];
      j++;
    }
    k++;
  }

  while (i < left_arr.length) {
    array[k] = left_arr[i];
    k++;
    i++;
  }

  while (j < right_arr.length) {
    array[k] = right_arr[j];
    k++;
    j++;
  }
}
