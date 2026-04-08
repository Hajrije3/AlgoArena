import { Link } from 'react-router-dom';
import { SortingBars }            from '@/components/Sorting/SortingBars';
import { SortingControls }         from '@/components/Sorting/SortingControls';
import { SortingStepPanel } from '@/components/UI/StepDescription';
import { PlaybackBar }     from '@/components/UI/PlaybackBar';
import { Toast }           from '@/components/UI/Toast';
import { useToast }        from '@/hooks/useToast';
import { useSorter }        from '@/features/sorting/useSorter';
import { usePlayback }      from '@/hooks/usePlayback';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { shuffleBars, seekToFrame } from '@/features/sorting/sortingSlice';

import { BAR_MIN, BAR_MAX, SORT_BASE_MS } from '@/features/sorting/types';

function makeRandomValues(count: number) {
  return Array.from({ length: count }, () =>
    BAR_MIN + Math.floor(Math.random() * (BAR_MAX - BAR_MIN + 1)),
  );
}

export default function SortingPage() {
  const dispatch    = useAppDispatch();
  const isComplete  = useAppSelector((s) => s.sorting.isComplete);
  const isRunning   = useAppSelector((s) => s.sorting.isRunning);
  const frames      = useAppSelector((s) => s.sorting.frames);
  const speed       = useAppSelector((s) => s.sorting.speed);
  const barCount    = useAppSelector((s) => s.sorting.barCount);
  const { sort, stop } = useSorter();
  const { toasts, showToast, dismiss } = useToast();

  const totalFrames  = frames?.length ?? 0;
  const showPlayback = isComplete && !isRunning && totalFrames > 0;

  const playback = usePlayback(
    showPlayback ? totalFrames : 0,
    (f) => { if (showPlayback) dispatch(seekToFrame(f)); },
    Math.round(SORT_BASE_MS / speed),
  );

  function handleShuffle() {
    dispatch(shuffleBars(makeRandomValues(barCount)));
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
        <span className="text-gray-500 text-sm">Sorting Visualizer</span>
      </header>

      <SortingControls onSort={sort} onStop={stop} onShuffle={handleShuffle} onToast={showToast} />

      <main className="flex-1 relative overflow-hidden">
        {/* Visualization */}
        <div className="w-full h-full flex flex-col items-center justify-center px-8 py-6 gap-4">
          <div className="w-full max-w-5xl">
            <SortingBars />
          </div>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            {[
              { label: 'Unsorted',  cls: 'bg-indigo-500'  },
              { label: 'Comparing', cls: 'bg-yellow-400'  },
              { label: 'Swapping',  cls: 'bg-rose-500'    },
              { label: 'Sorted',    cls: 'bg-emerald-400' },
            ].map(({ label, cls }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-sm ${cls}`} />
                {label}
              </span>
            ))}
          </div>

          {isComplete && (
            <p className="text-emerald-400 text-sm font-medium animate-pulse">
              ✓ Sorted!
            </p>
          )}
        </div>

        {/* Step description panel */}
        <SortingStepPanel />
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
