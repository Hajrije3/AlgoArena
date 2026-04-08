import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import type { AlgorithmType } from '@/features/pathfinding/types';
import type { AnimFrame } from '@/features/sorting/types';

// ─── Sorting helpers ──────────────────────────────────────────────────────────

function describeFrame(frame: AnimFrame): string {
  const { values, comparing, swapping, sorted } = frame;
  if (swapping.length === 2) {
    const [a, b] = swapping;
    return `Swapping ${values[a]} (index ${a}) ↔ ${values[b]} (index ${b})`;
  }
  if (comparing.length === 2) {
    const [a, b] = comparing;
    const needsSwap = values[a] > values[b];
    return (
      `Checking if ${values[a]} (index ${a}) > ${values[b]} (index ${b}) ` +
      `and swap them if that is true; swapped = ${needsSwap}`
    );
  }
  if (sorted.length > 0) {
    return `${sorted.length} element${sorted.length !== 1 ? 's' : ''} in final position`;
  }
  return 'Processing…';
}

// ─── Slim bar — shown only while the sort is actively running ─────────────────

export function SortingStepDescription() {
  const values    = useAppSelector((s) => s.sorting.values);
  const comparing = useAppSelector((s) => s.sorting.comparing);
  const swapping  = useAppSelector((s) => s.sorting.swapping);
  const sorted    = useAppSelector((s) => s.sorting.sorted);
  const isRunning = useAppSelector((s) => s.sorting.isRunning);

  if (!isRunning) return null;

  let msg   = '';
  let color = 'text-gray-400';

  if (swapping.length === 2) {
    const [a, b] = swapping;
    msg   = `Swapping ${values[a]} ↔ ${values[b]}`;
    color = 'text-rose-400';
  } else if (comparing.length === 2) {
    const [a, b] = comparing;
    const gt = values[a] > values[b];
    msg   = `Comparing ${values[a]} and ${values[b]} — ${gt ? 'swap needed' : 'already in order'}`;
    color = 'text-yellow-400';
  } else {
    msg   = `${sorted.length} element${sorted.length !== 1 ? 's' : ''} in final position`;
    color = 'text-gray-400';
  }

  return (
    <div className="w-full bg-gray-900/60 border-b border-gray-800/60 px-6 py-1.5 text-xs font-mono shrink-0">
      <span className={color}>{msg}</span>
    </div>
  );
}

// ─── Step panel — VisuAlgo style ─────────────────────────────────────────────

export function SortingStepPanel() {
  const isRunning    = useAppSelector((s) => s.sorting.isRunning);
  const isComplete   = useAppSelector((s) => s.sorting.isComplete);
  const frames       = useAppSelector((s) => s.sorting.frames);
  const currentFrame = useAppSelector((s) => s.sorting.currentFrame);
  // Live state (used while sorting is in progress)
  const values    = useAppSelector((s) => s.sorting.values);
  const comparing = useAppSelector((s) => s.sorting.comparing);
  const swapping  = useAppSelector((s) => s.sorting.swapping);
  const sorted    = useAppSelector((s) => s.sorting.sorted);

  const [open, setOpen] = useState(true);

  if (!isRunning && !isComplete) return null;

  // During live run use the live Redux state; during playback use stored frame
  const displayFrame: AnimFrame = frames
    ? frames[currentFrame]
    : { values, comparing, swapping, sorted };

  const currentDesc = describeFrame(displayFrame);
  const counter     = frames ? `${currentFrame + 1} / ${frames.length}` : 'Running…';

  return (
    <div className="absolute right-0 bottom-4 flex items-end z-20">
      {/* collapse toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-6 py-3 flex items-center justify-center bg-gray-900/80 border border-r-0 border-gray-700 rounded-l-md text-gray-500 hover:text-white hover:bg-gray-800 transition-colors text-sm backdrop-blur-sm"
        title={open ? 'Collapse' : 'Expand'}
      >
        {open ? '›' : '‹'}
      </button>

      {open && (
        <div className="w-80 border border-gray-700 bg-gray-900/95 backdrop-blur-sm rounded-l-lg overflow-hidden shadow-2xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Current step</span>
              <span className="text-xs font-mono text-gray-500">{counter}</span>
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 text-yellow-100 text-sm leading-relaxed">
              {currentDesc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pathfinding slim bar ─────────────────────────────────────────────────────

const ALGO_LABEL: Record<AlgorithmType, string> = {
  bfs: 'BFS', dfs: 'DFS', dijkstra: "Dijkstra's",
};

export function PathfindingStepDescription() {
  const visitedOrder  = useAppSelector((s) => s.pathfinding.visitedOrder);
  const pathPositions = useAppSelector((s) => s.pathfinding.pathPositions);
  const currentFrame  = useAppSelector((s) => s.pathfinding.currentFrame);
  const algorithm     = useAppSelector((s) => s.pathfinding.algorithm);
  const isRunning     = useAppSelector((s) => s.pathfinding.isRunning);
  const isFinished    = useAppSelector((s) => s.pathfinding.isFinished);

  if (!isRunning && !isFinished) return null;

  let msg   = '';
  let color = 'text-gray-400';

  if (isRunning) {
    msg   = `${ALGO_LABEL[algorithm]} is searching…`;
    color = 'text-indigo-400';
  } else if (visitedOrder) {
    if (currentFrame < visitedOrder.length) {
      const pos = visitedOrder[currentFrame];
      msg   = `${ALGO_LABEL[algorithm]}: exploring (row ${pos.row}, col ${pos.col}) — step ${currentFrame + 1} of ${visitedOrder.length}`;
      color = 'text-violet-400';
    } else if (pathPositions && pathPositions.length > 0) {
      const step = currentFrame - visitedOrder.length + 1;
      msg   = `Path found — tracing step ${step} of ${pathPositions.length}`;
      color = 'text-yellow-400';
    } else {
      msg   = `Search complete — no path exists (explored ${visitedOrder.length} nodes)`;
      color = 'text-rose-400';
    }
  }

  return (
    <div className="w-full bg-gray-900/60 border-b border-gray-800/60 px-6 py-1.5 text-xs font-mono shrink-0">
      <span className={color}>{msg}</span>
    </div>
  );
}
