import { Link } from 'react-router-dom';

// ─── Pathfinding grid preview ─────────────────────────────────────────────────
// 10 cols × 6 rows — shows start, end, walls, visited nodes, and the path

const GRID_CELLS = [
  'S', '.', '.', 'V', 'W', '.', '.', '.', '.', '.',
  'P', 'V', '.', 'V', 'W', 'V', '.', '.', '.', '.',
  'P', 'P', 'P', 'P', 'P', 'P', 'V', '.', '.', '.',
  '.', '.', '.', 'V', 'W', 'P', 'V', '.', '.', '.',
  '.', '.', '.', '.', 'W', 'P', 'P', 'V', '.', '.',
  '.', '.', '.', '.', 'W', '.', 'P', 'P', 'E', '.',
];

const CELL_COLOR: Record<string, string> = {
  '.': '#111827',
  'W': '#4b5563',
  'V': '#5b21b6',
  'P': '#fde047',
  'S': '#34d399',
  'E': '#f87171',
};

function PathfindingPreview() {
  return (
    <div
      className="w-full rounded overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: '2px',
        height: '80px',
      }}
    >
      {GRID_CELLS.map((cell, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{ background: CELL_COLOR[cell] }}
        />
      ))}
    </div>
  );
}

// ─── Sorting bars preview ─────────────────────────────────────────────────────
// Shows a bubble sort mid-run: sorted (green) | comparing (yellow) | unsorted (indigo)

const SORT_BARS = [
  { h: 12, c: '#34d399' },
  { h: 22, c: '#34d399' },
  { h: 34, c: '#34d399' },
  { h: 45, c: '#34d399' },
  { h: 55, c: '#34d399' },
  { h: 72, c: '#fbbf24' },
  { h: 63, c: '#fbbf24' },
  { h: 80, c: '#6366f1' },
  { h: 91, c: '#6366f1' },
  { h: 68, c: '#6366f1' },
  { h: 85, c: '#6366f1' },
  { h: 50, c: '#6366f1' },
];

function SortingPreview() {
  return (
    <div className="flex items-end gap-0.5 w-full h-20">
      {SORT_BARS.map(({ h, c }, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: `${h}%`, background: c }}
        />
      ))}
    </div>
  );
}

// ─── Feature cards ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    to:          '/visualizer',
    title:       'Pathfinding',
    accent:      'text-indigo-400',
    border:      'border-indigo-500/20 hover:border-indigo-500/50',
    cta:         'Open Pathfinder',
    ctaCls:      'bg-indigo-500 hover:bg-indigo-400',
    description: 'Watch BFS, DFS, and Dijkstra explore a grid in real time.',
    tags:        ['BFS', 'DFS', 'Dijkstra', 'Weighted nodes', 'Maze generator'],
    preview:     <PathfindingPreview />,
  },
  {
    to:          '/sorting',
    title:       'Sorting',
    accent:      'text-emerald-400',
    border:      'border-emerald-500/20 hover:border-emerald-500/50',
    cta:         'Open Sorter',
    ctaCls:      'bg-emerald-500 hover:bg-emerald-400',
    description: 'Compare Bubble, Selection, Insertion, and Merge sort step by step.',
    tags:        ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Live animation'],
    preview:     <SortingPreview />,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-7xl font-black tracking-tight mb-3">
          Algo<span className="text-indigo-400">Arena</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Interactive algorithm visualizations — see exactly how they work.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {FEATURES.map(({ to, title, accent, border, cta, ctaCls, description, tags, preview }) => (
          <div
            key={to}
            className={`
              bg-gray-900 rounded-xl border p-6 flex flex-col gap-5
              transition-colors duration-200 ${border}
            `}
          >
            <div className="w-full bg-gray-800/60 rounded-lg p-4 flex items-end justify-center">
              {preview}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold">
                {title} <span className={accent}>Visualizer</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              to={to}
              className={`
                mt-auto inline-flex items-center justify-center gap-2
                ${ctaCls} text-white font-semibold
                px-5 py-2.5 rounded-lg transition-colors text-sm
              `}
            >
              {cta} <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
