import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { store } from '@/app/store';
import { bfs }      from './algorithms/bfs';
import { dfs }      from './algorithms/dfs';
import { dijkstra } from './algorithms/dijkstra';
import { astar }    from './algorithms/astar';
import {
  resetVisualization,
  setRunning,
  setFinished,
  setStats,
  markVisited,
  markPath,
  storeRunResult,
} from './pathfindingSlice';
import { SPEED_DELAY_MS } from './types';
import { saveRun } from '@/services/api';

export function useVisualizer() {
  const dispatch  = useAppDispatch();
  const algorithm = useAppSelector((s) => s.pathfinding.algorithm);
  const speed     = useAppSelector((s) => s.pathfinding.speed);
  const startNode = useAppSelector((s) => s.pathfinding.startNode);
  const endNode   = useAppSelector((s) => s.pathfinding.endNode);

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const stop = useCallback(() => {
    cancelAll();
    dispatch(setRunning(false));
  }, [cancelAll, dispatch]);

  const run = useCallback((onNoPath?: () => void) => {
    cancelAll();
    dispatch(resetVisualization());

    const { grid } = store.getState().pathfinding;

    // Snapshot the clean grid (walls/weights only) for playback seeking
    const baseGrid = grid.map(row => row.map(node => ({ ...node })));

    const result =
      algorithm === 'bfs'      ? bfs(grid, startNode, endNode)      :
      algorithm === 'dfs'      ? dfs(grid, startNode, endNode)      :
      algorithm === 'dijkstra' ? dijkstra(grid, startNode, endNode) :
                                 astar(grid, startNode, endNode);

    const { visitedOrder, path } = result;
    const visitDelay = SPEED_DELAY_MS[speed];
    const pathDelay  = visitDelay * 2.5;
    const startTime  = Date.now();

    dispatch(setRunning(true));

    visitedOrder.forEach((pos, i) => {
      const t = setTimeout(() => dispatch(markVisited(pos)), i * visitDelay);
      timeouts.current.push(t);
    });

    const phaseTwo = visitedOrder.length * visitDelay;

    const finish = () => {
      const durationMs = Date.now() - startTime;
      dispatch(setRunning(false));
      dispatch(setFinished(true));
      dispatch(setStats({
        algorithm,
        visitedCount: visitedOrder.length,
        pathLength: result.found ? path.length + 2 : 0,
        found: result.found,
      }));
      dispatch(storeRunResult({
        visitedOrder,
        pathPositions: result.found ? path : [],
        baseGrid,
      }));
      saveRun({
        type: 'pathfinding',
        algorithm,
        durationMs,
        nodesVisited: visitedOrder.length,
        pathLength: result.found ? path.length + 2 : 0,
        pathFound: result.found,
      });
      if (!result.found) onNoPath?.();
    };

    if (path.length > 0) {
      path.forEach((pos, i) => {
        const t = setTimeout(() => {
          dispatch(markPath(pos));
          if (i === path.length - 1) finish();
        }, phaseTwo + i * pathDelay);
        timeouts.current.push(t);
      });
    } else {
      const t = setTimeout(finish, phaseTwo);
      timeouts.current.push(t);
    }
  }, [cancelAll, dispatch, algorithm, speed, startNode, endNode]);

  return { run, stop };
}
