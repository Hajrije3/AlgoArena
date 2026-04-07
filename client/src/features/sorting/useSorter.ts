import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { bubbleSort }    from './algorithms/bubbleSort';
import { selectionSort } from './algorithms/selectionSort';
import { insertionSort } from './algorithms/insertionSort';
import { mergeSort }     from './algorithms/mergeSort';
import { applyFrame, setRunning, setComplete, storeFrames } from './sortingSlice';
import { SORT_SPEED_MS } from './types';
import { saveRun } from '@/services/api';

export function useSorter() {
  const dispatch   = useAppDispatch();
  const values     = useAppSelector((s) => s.sorting.values);
  const algorithm  = useAppSelector((s) => s.sorting.algorithm);
  const speed      = useAppSelector((s) => s.sorting.speed);
  const isRunning  = useAppSelector((s) => s.sorting.isRunning);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const stop = useCallback(() => {
    cancelAll();
    dispatch(setRunning(false));
  }, [cancelAll, dispatch]);

  const sort = useCallback(() => {
    if (isRunning) return;

    cancelAll();

    const frames =
      algorithm === 'bubble'    ? bubbleSort(values)    :
      algorithm === 'selection' ? selectionSort(values) :
      algorithm === 'insertion' ? insertionSort(values) :
                                  mergeSort(values);

    const delay = SORT_SPEED_MS[speed];
    const startTime = Date.now();
    const comparisons = frames.filter((f) => f.comparing.length > 0).length;
    const swaps = frames.filter((f) => f.swapping.length > 0).length;

    dispatch(setRunning(true));
    dispatch(setComplete(false));

    frames.forEach((frame, i) => {
      const t = setTimeout(() => {
        dispatch(applyFrame(frame));

        if (i === frames.length - 1) {
          dispatch(setRunning(false));
          dispatch(setComplete(true));
          dispatch(storeFrames(frames));
          saveRun({
            type: 'sorting',
            algorithm,
            durationMs: Date.now() - startTime,
            comparisons,
            swaps,
            arraySize: values.length,
          });
        }
      }, i * delay);

      timeouts.current.push(t);
    });
  }, [cancelAll, dispatch, values, algorithm, speed, isRunning]);

  return { sort, stop };
}
