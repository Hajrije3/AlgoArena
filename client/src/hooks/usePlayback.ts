import { useState, useEffect, useRef, useCallback } from 'react';

export function usePlayback(
  total: number,
  onSeek: (frame: number) => void,
  intervalMs: number,
) {
  const [frame, setFrame]       = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const onSeekRef = useRef(onSeek);
  onSeekRef.current = onSeek;

  // Notify parent on every frame change
  useEffect(() => {
    onSeekRef.current(frame);
  }, [frame]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || total === 0) return;
    const id = setInterval(() => {
      setFrame(f => {
        if (f >= total - 1) {
          setIsPlaying(false);
          return total - 1;
        }
        return f + 1;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [isPlaying, total, intervalMs]);

  // Reset when a new run result arrives (total changes)
  const prevTotal = useRef(total);
  useEffect(() => {
    if (total !== prevTotal.current) {
      prevTotal.current = total;
      setIsPlaying(false);
      setFrame(total > 0 ? total - 1 : 0);
    }
  }, [total]);

  const seek = useCallback((f: number) => {
    setIsPlaying(false);
    setFrame(Math.max(0, Math.min(f, total - 1)));
  }, [total]);

  const play = useCallback(() => {
    if (frame >= total - 1) setFrame(0);
    setIsPlaying(true);
  }, [frame, total]);

  const pause    = useCallback(() => setIsPlaying(false), []);
  const stepBack = useCallback(() => { setIsPlaying(false); setFrame(f => Math.max(0, f - 1)); }, []);
  const stepFwd  = useCallback(() => { setIsPlaying(false); setFrame(f => Math.min(total - 1, f + 1)); }, [total]);
  const toStart  = useCallback(() => { setIsPlaying(false); setFrame(0); }, []);
  const toEnd    = useCallback(() => { setIsPlaying(false); setFrame(total - 1); }, [total]);

  const replay = useCallback(() => {
    setFrame(0);
    setIsPlaying(true);
  }, []);

  return { frame, isPlaying, play, pause, replay, seek, stepBack, stepFwd, toStart, toEnd };
}
