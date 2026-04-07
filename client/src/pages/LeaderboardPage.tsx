import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentRuns, getLeaderboard, type Run } from '@/services/api';

type VisualizerType = 'pathfinding' | 'sorting';

const PATHFINDING_ALGOS = ['bfs', 'dfs', 'dijkstra', 'astar'];
const SORTING_ALGOS     = ['bubble', 'selection', 'insertion', 'merge'];

const ALGO_LABELS: Record<string, string> = {
  bfs:       'BFS',
  dfs:       'DFS',
  dijkstra:  'Dijkstra',
  astar:     'A*',
  bubble:    'Bubble',
  selection: 'Selection',
  insertion: 'Insertion',
  merge:     'Merge',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [activeType, setActiveType] = useState<VisualizerType>('pathfinding');
  const [activeAlgo, setActiveAlgo] = useState('bfs');
  const [leaderboard, setLeaderboard] = useState<Run[]>([]);
  const [recent, setRecent]           = useState<Run[]>([]);
  const [loadingBoard, setLoadingBoard]   = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (t: VisualizerType) => {
    setActiveType(t);
    setActiveAlgo(t === 'pathfinding' ? 'bfs' : 'bubble');
  };

  useEffect(() => {
    setLoadingBoard(true);
    setError(null);
    getLeaderboard(activeType, activeAlgo)
      .then(setLeaderboard)
      .catch(() => setError('Could not load leaderboard'))
      .finally(() => setLoadingBoard(false));
  }, [activeType, activeAlgo]);

  useEffect(() => {
    getRecentRuns(20)
      .then(setRecent)
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, []);

  const algos = activeType === 'pathfinding' ? PATHFINDING_ALGOS : SORTING_ALGOS;
  const isPath = activeType === 'pathfinding';

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">
              Algo<span className="text-indigo-400">Arena</span> Leaderboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Top runs ranked by efficiency</p>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Home
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          {/* Type tabs */}
          <div className="flex border-b border-gray-800">
            {(['pathfinding', 'sorting'] as VisualizerType[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeType === t
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Algorithm tabs */}
          <div className="flex gap-2 px-4 py-3 border-b border-gray-800 flex-wrap">
            {algos.map((algo) => (
              <button
                key={algo}
                onClick={() => setActiveAlgo(algo)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  activeAlgo === algo
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {ALGO_LABELS[algo]}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loadingBoard ? (
              <div className="text-center py-12 text-gray-600">Loading...</div>
            ) : error ? (
              <div className="text-center py-12 text-rose-400">{error}</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No runs yet for {ALGO_LABELS[activeAlgo]}. Run the visualizer first!
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2 w-10">#</th>
                    <th className="px-4 py-2">{isPath ? 'Nodes Visited' : 'Comparisons'}</th>
                    <th className="px-4 py-2">{isPath ? 'Path Length' : 'Swaps'}</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((run, i) => (
                    <tr key={run._id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-sm w-10">
                        {MEDAL[i] ?? `#${i + 1}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-violet-400 font-mono">
                        {isPath ? run.nodesVisited : run.comparisons}
                      </td>
                      <td className="px-4 py-3 text-sm text-yellow-400 font-mono">
                        {isPath
                          ? run.pathFound ? run.pathLength : <span className="text-rose-400">no path</span>
                          : run.swaps}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 font-mono">{run.durationMs}ms</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{timeAgo(run.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent runs */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300">Recent Runs</h2>
          </div>
          <div className="overflow-x-auto">
            {loadingRecent ? (
              <div className="text-center py-8 text-gray-600">Loading...</div>
            ) : recent.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No runs yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Algorithm</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Key Stat</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((run) => (
                    <tr key={run._id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                          {ALGO_LABELS[run.algorithm] ?? run.algorithm}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${run.type === 'pathfinding' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                          {run.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                        {run.type === 'pathfinding'
                          ? run.pathFound
                            ? `${run.nodesVisited} nodes · ${run.pathLength} steps`
                            : 'no path found'
                          : `${run.comparisons} cmp · ${run.swaps} swaps`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{run.durationMs}ms</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{timeAgo(run.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
