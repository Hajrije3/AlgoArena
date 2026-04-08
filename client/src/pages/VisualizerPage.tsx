import { Link } from 'react-router-dom';
import Grid          from '@/components/Grid/Grid';
import ControlsPanel from '@/components/Controls/ControlsPanel';
import { StatsBar }  from '@/components/UI/StatsBar';
import { PathfindingStepDescription } from '@/components/UI/StepDescription';
import { Toast }     from '@/components/UI/Toast';
import { PlaybackBar } from '@/components/UI/PlaybackBar';
import { useVisualizer }   from '@/features/pathfinding/useVisualizer';
import { useMazeGenerator } from '@/features/pathfinding/useMazeGenerator';
import { useToast }         from '@/hooks/useToast';
import { usePlayback }      from '@/hooks/usePlayback';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { seekToFrame } from '@/features/pathfinding/pathfindingSlice';
import { PATH_BASE_MS } from '@/features/pathfinding/types';

export default function VisualizerPage() {
  const dispatch = useAppDispatch();
  const { run, stop }    = useVisualizer();
  const { generateMaze } = useMazeGenerator();
  const { toasts, showToast, dismiss } = useToast();

  const isFinished   = useAppSelector((s) => s.pathfinding.isFinished);
  const isRunning    = useAppSelector((s) => s.pathfinding.isRunning);
  const totalFrames  = useAppSelector((s) => s.pathfinding.totalFrames);
  const speed        = useAppSelector((s) => s.pathfinding.speed);

  const showPlayback = isFinished && !isRunning && totalFrames > 0;

  const playback = usePlayback(
    showPlayback ? totalFrames : 0,
    (f) => { if (showPlayback) dispatch(seekToFrame(f)); },
    Math.round(PATH_BASE_MS / speed),
  );

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
      <PathfindingStepDescription />

      <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <Grid />
      </main>

      {showPlayback && (
        <PlaybackBar
          frame={playback.frame}
          total={totalFrames}
          isPlaying={playback.isPlaying}
          onFirst={playback.toStart}
          onStepBack={playback.stepBack}
          onReplay={playback.replay}
          onPlayPause={playback.isPlaying ? playback.pause : playback.play}
          onStepFwd={playback.stepFwd}
          onLast={playback.toEnd}
          onSeek={playback.seek}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
