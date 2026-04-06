export type BarState = 'idle' | 'comparing' | 'swapping' | 'sorted';
export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge';
export type SortSpeed = 'slow' | 'medium' | 'fast';

export interface AnimFrame {
  values:    number[];
  comparing: number[];
  swapping:  number[];
  sorted:    number[];
}

export const SORT_SPEED_MS: Record<SortSpeed, number> = {
  slow:   40,
  medium: 12,
  fast:   3,
};

export const BAR_COUNT = 50;
export const BAR_MIN   = 5;
export const BAR_MAX   = 100;

export const ALGO_INFO: Record<SortAlgorithm, { label: string; complexity: string }> = {
  bubble:    { label: 'Bubble Sort',    complexity: 'O(n²) · stable'          },
  selection: { label: 'Selection Sort', complexity: 'O(n²) · not stable'      },
  insertion: { label: 'Insertion Sort', complexity: 'O(n²) best O(n) · stable' },
  merge:     { label: 'Merge Sort',     complexity: 'O(n log n) · stable'     },
};
