import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { recursiveBacktracking, getMazeBounds } from './algorithms/mazeGenerator';
import {
  setStartNode,
  setEndNode,
  fillWithWalls,
  toggleWall,
  setGeneratingMaze,
} from './pathfindingSlice';

const MAZE_STEP_MS = 8;

export function useMazeGenerator() {
  const dispatch         = useAppDispatch();
  const rows             = useAppSelector((s) => s.pathfinding.rows);
  const cols             = useAppSelector((s) => s.pathfinding.cols);
  const isRunning        = useAppSelector((s) => s.pathfinding.isRunning);
  const isGeneratingMaze = useAppSelector((s) => s.pathfinding.isGeneratingMaze);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelMaze = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    dispatch(setGeneratingMaze(false));
  }, [dispatch]);

  const generateMaze = useCallback(() => {
    if (isRunning || isGeneratingMaze) return;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    const { start, end } = getMazeBounds(rows, cols);

    dispatch(setStartNode(start));
    dispatch(setEndNode(end));

    dispatch(fillWithWalls());
    dispatch(setGeneratingMaze(true));

    const carveOrder = recursiveBacktracking(rows, cols);

    carveOrder.forEach((pos, i) => {
      const t = setTimeout(() => {
        dispatch(toggleWall(pos));

        if (i === carveOrder.length - 1) {
          dispatch(setGeneratingMaze(false));
          timeouts.current = [];
        }
      }, i * MAZE_STEP_MS);

      timeouts.current.push(t);
    });
  }, [dispatch, rows, cols, isRunning, isGeneratingMaze]);

  return { generateMaze, cancelMaze };
}
