import type { AnimFrame } from '../types';

export function mergeSort(initial: number[]): AnimFrame[] {
  const arr = [...initial];
  const frames: AnimFrame[] = [];
  const sorted = new Set<number>();

  function pushFrame(comparing: number[], swapping: number[]) {
    frames.push({
      values:    [...arr],
      comparing,
      swapping,
      sorted: Array.from(sorted),
    });
  }

  function merge(left: number, mid: number, right: number) {
    const leftArr  = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      pushFrame([left + i, mid + 1 + j], []);

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      pushFrame([], [k]);
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      pushFrame([], [k]);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      pushFrame([], [k]);
      j++;
      k++;
    }

    if (left === 0 && right === arr.length - 1) {
      for (let x = left; x <= right; x++) sorted.add(x);
      pushFrame([], []);
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSortHelper(0, arr.length - 1);

  for (let x = 0; x < arr.length; x++) sorted.add(x);
  frames.push({ values: [...arr], comparing: [], swapping: [], sorted: Array.from(sorted) });

  return frames;
}
