import type { AnimFrame } from '../types';

export function bubbleSort(initial: number[]): AnimFrame[] {
  const arr = [...initial];
  const n = arr.length;
  const frames: AnimFrame[] = [];
  const sortedSet = new Set<number>();
  const getSorted = () => Array.from(sortedSet);

  for (let pass = 0; pass < n - 1; pass++) {
    for (let i = 0; i < n - pass - 1; i++) {
      frames.push({ values: [...arr], comparing: [i, i + 1], swapping: [], sorted: getSorted() });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        frames.push({ values: [...arr], comparing: [], swapping: [i, i + 1], sorted: getSorted() });
      }
    }
    sortedSet.add(n - 1 - pass);
    frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });
  }

  sortedSet.add(0);
  frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });

  return frames;
}
