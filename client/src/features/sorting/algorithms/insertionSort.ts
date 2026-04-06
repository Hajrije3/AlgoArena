import type { AnimFrame } from '../types';

export function insertionSort(initial: number[]): AnimFrame[] {
  const arr = [...initial];
  const n = arr.length;
  const frames: AnimFrame[] = [];
  const sortedSet = new Set<number>([0]);
  const getSorted = () => Array.from(sortedSet);

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0 && arr[j - 1] > arr[j]) {
      frames.push({ values: [...arr], comparing: [j - 1, j], swapping: [], sorted: getSorted() });

      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      frames.push({ values: [...arr], comparing: [], swapping: [j - 1, j], sorted: getSorted() });

      j--;
    }

    sortedSet.add(i);
    frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });
  }

  for (let i = 0; i < n; i++) sortedSet.add(i);
  frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });

  return frames;
}
