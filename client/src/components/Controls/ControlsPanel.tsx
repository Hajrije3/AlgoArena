import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setAlgorithm,
  setSpeed,
  setDrawMode,
  clearWalls,
  resetVisualization,
  resetBoard,
} from '@/features/pathfinding/pathfindingSlice';
import type { AlgorithmType, SpeedType, DrawMode } from '@/features/pathfinding/types';

const ALGORITHMS: { value: AlgorithmType; label: string }[] = [
  { value: 'bfs',      label: 'BFS'      },
  { value: 'dfs',      label: 'DFS'      },
  { value: 'dijkstra', label: 'Dijkstra' },
  { value: 'astar',    label: 'A*'       },
];

const SPEEDS: { value: SpeedType; label: string }[] = [
  { value: 'slow',   label: 'Slow'   },
  { value: 'medium', label: 'Medium' },
  { value: 'fast',   label: 'Fast'   },
];

const DRAW_MODES: { value: DrawMode; label: string; activeClass: string }[] = [
  { value: 'wall',   label: 'Walls',   activeClass: 'bg-gray-500 text-white'  },
  { value: 'weight', label: 'Weights', activeClass: 'bg-amber-500 text-white' },
];

const LEGEND = [
  { label: 'Start',   cls: 'bg-emerald-400' },
  { label: 'End',     cls: 'bg-rose-400'    },
  { label: 'Wall',    cls: 'bg-gray-500'    },
  { label: 'Weight',  cls: 'bg-amber-500'   },
  { label: 'Visited', cls: 'bg-violet-600'  },
  { label: 'Path',    cls: 'bg-yellow-300'  },
];

interface Props {
  onVisualize: () => void;
  onStop: () => void;
  onGenerateMaze: () => void;
}

export default function ControlsPanel({ onVisualize, onStop, onGenerateMaze }: Props) {
  const dispatch          = useAppDispatch();
  const algorithm         = useAppSelector((s) => s.pathfinding.algorithm);
  const speed             = useAppSelector((s) => s.pathfinding.speed);
  const drawMode          = useAppSelector((s) => s.pathfinding.drawMode);
  const isRunning         = useAppSelector((s) => s.pathfinding.isRunning);
  const isFinished        = useAppSelector((s) => s.pathfinding.isFinished);
  const isGeneratingMaze  = useAppSelector((s) => s.pathfinding.isGeneratingMaze);

  const disabled = isRunning || isGeneratingMaze;

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

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Draw</span>
        <div className="flex rounded-md overflow-hidden border border-gray-700">
          {DRAW_MODES.map(({ value, label, activeClass }) => (
            <button
              key={value}
              disabled={disabled}
              onClick={() => dispatch(setDrawMode(value))}
              className={`
                px-3 py-1.5 text-sm font-medium transition-colors
                ${drawMode === value
                  ? activeClass
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerateMaze}
        disabled={disabled}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isGeneratingMaze ? 'Generating…' : 'Generate Maze'}
      </button>

      <div className="h-6 w-px bg-gray-700 hidden sm:block" />

      <div className="flex items-center gap-2">
        {isRunning ? (
          <button
            onClick={onStop}
            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer bg-rose-500 hover:bg-rose-400 text-white"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={onVisualize}
            className="px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white"
          >
            {isFinished ? 'Run Again' : 'Visualize'}
          </button>
        )}

        <button
          onClick={() => dispatch(resetVisualization())}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Reset Viz
        </button>

        <button
          onClick={() => dispatch(clearWalls())}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Clear Walls
        </button>

        <button
          onClick={() => dispatch(resetBoard())}
          disabled={disabled}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Reset Board
        </button>
      </div>

      <div className="ml-auto hidden lg:flex items-center gap-3">
        {LEGEND.map(({ label, cls }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-3.5 h-3.5 rounded-sm inline-block ${cls}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
