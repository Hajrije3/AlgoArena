import { useAppSelector } from '@/app/hooks';
import type { AlgorithmType } from '@/features/pathfinding/types';

const ALGO_LABEL: Record<AlgorithmType, string> = {
  bfs:      'BFS',
  dfs:      'DFS',
  dijkstra: "Dijkstra's",
  astar:    'A*',
};

export function StatsBar() {
  const stats = useAppSelector((s) => s.pathfinding.stats);
  if (!stats) return null;

  return (
    <div className="w-full bg-gray-900/60 border-b border-gray-800/60 px-6 py-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-xs tracking-wide">
        {ALGO_LABEL[stats.algorithm]}
      </span>

      <span className="text-gray-400">
        Visited{' '}
        <span className="text-white font-semibold">{stats.visitedCount}</span>{' '}
        nodes
      </span>

      {stats.found ? (
        <>
          <span className="text-gray-400">
            Path{' '}
            <span className="text-emerald-400 font-semibold">{stats.pathLength}</span>{' '}
            nodes
          </span>
          <span className="text-emerald-500 text-xs font-medium">✓ Path found</span>
        </>
      ) : (
        <span className="text-rose-400 font-medium">✕ No path found</span>
      )}
    </div>
  );
}
