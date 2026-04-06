import type { AnimFrame } from '../types';

export function selectionSort(initial: number[]): AnimFrame[] {
  const arr = [...initial];
  const n = arr.length;
  const frames: AnimFrame[] = [];
  const sortedSet = new Set<number>();
  const getSorted = () => Array.from(sortedSet);

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      frames.push({ values: [...arr], comparing: [minIdx, j], swapping: [], sorted: getSorted() });

      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      frames.push({ values: [...arr], comparing: [], swapping: [i, minIdx], sorted: getSorted() });
    }

    sortedSet.add(i);
    frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });
  }

  sortedSet.add(n - 1);
  frames.push({ values: [...arr], comparing: [], swapping: [], sorted: getSorted() });

  return frames;
}
