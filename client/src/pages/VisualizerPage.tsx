import { Link } from 'react-router-dom';
import Grid          from '@/components/Grid/Grid';
import ControlsPanel from '@/components/Controls/ControlsPanel';
import { StatsBar }  from '@/components/UI/StatsBar';
import { Toast }     from '@/components/UI/Toast';
import { useVisualizer }   from '@/features/pathfinding/useVisualizer';
import { useMazeGenerator } from '@/features/pathfinding/useMazeGenerator';
import { useToast }         from '@/hooks/useToast';

export default function VisualizerPage() {
  const { run, stop }    = useVisualizer();
  const { generateMaze } = useMazeGenerator();
  const { toasts, showToast, dismiss } = useToast();

  function handleVisualize() {
    run(() => showToast('No path found — the end node is unreachable.', 'error'));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center gap-3 shrink-0">
        <Link
          to="/"
          className="text-lg font-black tracking-tight hover:opacity-75 transition-opacity"
        >
          Algo<span className="text-indigo-400">Arena</span>
        </Link>
        <span className="text-gray-700 text-sm">|</span>
        <span className="text-gray-500 text-sm">Pathfinding Visualizer</span>
      </header>

      <ControlsPanel
        onVisualize={handleVisualize}
        onStop={stop}
        onGenerateMaze={generateMaze}
      />

      <StatsBar />

      <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <Grid />
      </main>

      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
