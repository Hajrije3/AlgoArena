import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setAlgorithm, setSpeed } from '@/features/sorting/sortingSlice';
import type { SortAlgorithm, SortSpeed } from '@/features/sorting/types';
import { ALGO_INFO } from '@/features/sorting/types';

const ALGORITHMS: { value: SortAlgorithm; label: string }[] = [
  { value: 'bubble',    label: 'Bubble'    },
  { value: 'selection', label: 'Selection' },
  { value: 'insertion', label: 'Insertion' },
  { value: 'merge',     label: 'Merge'     },
];

const SPEEDS: { value: SortSpeed; label: string }[] = [
  { value: 'slow',   label: 'Slow'   },
  { value: 'medium', label: 'Medium' },
  { value: 'fast',   label: 'Fast'   },
];

interface Props {
  onSort:    () => void;
  onStop:    () => void;
  onShuffle: () => void;
}

export function SortingControls({ onSort, onStop, onShuffle }: Props) {
  const dispatch    = useAppDispatch();
  const algorithm   = useAppSelector((s) => s.sorting.algorithm);
  const speed       = useAppSelector((s) => s.sorting.speed);
  const isRunning   = useAppSelector((s) => s.sorting.isRunning);
  const isComplete  = useAppSelector((s) => s.sorting.isComplete);

  const disabled = isRunning;

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Algorithm</span>
        <div className="flex rounded-md overflow-hidden border border-gray-700">
          {ALGORITHMS.map(({ value, label }) => (
            <button
              key={value}
              disabled={disabled}
              onClick={() => dispatch(setAlgorithm(value))}
              className={`
                px-3 py-1.5 text-sm font-medium transition-colors
                ${algorithm === value
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Speed</span>
        <div className="flex rounded-md overflow-hidden border border-gray-700">
          {SPEEDS.map(({ value, label }) => (
            <button
              key={value}
              disabled={disabled}
              onClick={() => dispatch(setSpeed(value))}
              className={`
                px-3 py-1.5 text-sm font-medium transition-colors
                ${speed === value
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-gray-700 hidden sm:block" />

      <div className="flex items-center gap-2">
        {isRunning ? (
          <button
            onClick={onStop}
            className="px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer bg-rose-500 hover:bg-rose-400 text-white transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onSort}
            className="px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
          >
            {isComplete ? 'Sort Again' : 'Sort'}
          </button>
        )}

        <button
          onClick={onShuffle}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Shuffle
        </button>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-400">{ALGO_INFO[algorithm].label}</span>
        <span>·</span>
        <span>{ALGO_INFO[algorithm].complexity}</span>
      </div>
    </div>
  );
}
