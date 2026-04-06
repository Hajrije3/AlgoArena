import { useAppSelector } from '@/app/hooks';
import type { BarState } from '@/features/sorting/types';
import { BAR_MAX } from '@/features/sorting/types';

const STATE_CLASS: Record<BarState, string> = {
  idle:      'bg-indigo-500',
  comparing: 'bg-yellow-400',
  swapping:  'bg-rose-500',
  sorted:    'bg-emerald-400',
};

export function SortingBars() {
  const values    = useAppSelector((s) => s.sorting.values);
  const comparing = useAppSelector((s) => s.sorting.comparing);
  const swapping  = useAppSelector((s) => s.sorting.swapping);
  const sorted    = useAppSelector((s) => s.sorting.sorted);

  function getState(i: number): BarState {
    if (swapping.includes(i))  return 'swapping';
    if (comparing.includes(i)) return 'comparing';
    if (sorted.includes(i))    return 'sorted';
    return 'idle';
  }

  return (
    <div className="w-full flex items-end gap-px" style={{ height: '340px' }}>
      {values.map((val, i) => {
        const state = getState(i);
        return (
          <div
            key={i}
            className={`flex-1 rounded-t transition-colors duration-75 ${STATE_CLASS[state]}`}
            style={{ height: `${(val / BAR_MAX) * 100}%` }}
          />
        );
      })}
    </div>
  );
}
