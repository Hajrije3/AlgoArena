import { Link } from 'react-router-dom';

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
    preview: (
      <div className="flex items-end gap-1 h-10">
        {[4, 7, 5, 9, 3, 8, 6, 10, 2, 7].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm"
            style={{
              height: `${h * 10}%`,
              background: i < 5 ? '#6366f1' : i < 8 ? '#7c3aed' : '#fde047',
            }}
          />
        ))}
      </div>
    ),
  },
  {
    to:          '/sorting',
    title:       'Sorting',
    accent:      'text-emerald-400',
    border:      'border-emerald-500/20 hover:border-emerald-500/50',
    cta:         'Open Sorter',
    ctaCls:      'bg-emerald-500 hover:bg-emerald-400',
    description: 'Compare Bubble, Selection, and Insertion sort step by step.',
    tags:        ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Live animation'],
    preview: (
      <div className="flex items-end gap-0.5 h-10">
        {[3, 7, 2, 9, 1, 8, 4, 6, 5, 10].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h * 10}%`,
              background: i < 3 ? '#34d399' : i < 5 ? '#fbbf24' : '#6366f1',
            }}
          />
        ))}
      </div>
    ),
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
