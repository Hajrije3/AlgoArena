interface Props {
  frame: number;
  total: number;
  isPlaying: boolean;
  onFirst:    () => void;
  onStepBack: () => void;
  onReplay:   () => void;
  onPlayPause: () => void;
  onStepFwd:  () => void;
  onLast:     () => void;
  onSeek:     (frame: number) => void;
}

const BTN = 'w-8 h-8 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold';

export function PlaybackBar({
  frame, total, isPlaying,
  onFirst, onStepBack, onReplay, onPlayPause, onStepFwd, onLast, onSeek,
}: Props) {
  if (total === 0) return null;

  const progress = total > 1 ? frame / (total - 1) : 1;

  return (
    <div className="w-full bg-gray-900 border-t border-gray-800 px-6 py-2 flex items-center gap-3">

      {/* |◄ first */}
      <button className={BTN} onClick={onFirst} disabled={frame === 0} title="First frame">
        ⏮
      </button>

      {/* ◄◄ step back */}
      <button className={BTN} onClick={onStepBack} disabled={frame === 0} title="Step back">
        ◀◀
      </button>

      {/* ↺ replay from start */}
      <button className={BTN} onClick={onReplay} title="Replay from start">
        ↺
      </button>

      {/* ▶▶ / ❚❚ play-pause */}
      <button className={BTN} onClick={onPlayPause} title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '❚❚' : '▶▶'}
      </button>

      {/* ► step forward */}
      <button className={BTN} onClick={onStepFwd} disabled={frame === total - 1} title="Step forward">
        ▶
      </button>

      {/* ►| last */}
      <button className={BTN} onClick={onLast} disabled={frame === total - 1} title="Last frame">
        ⏭
      </button>

      {/* Scrubber */}
      <div className="flex-1 relative h-2 group">
        <div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={total - 1}
          value={frame}
          onChange={(e) => onSeek(parseInt(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
    </div>
  );
}
