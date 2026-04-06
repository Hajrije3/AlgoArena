import type { GridNode, Position } from '../types';
import { WEIGHT_COST } from '../types';
import type { AlgorithmResult } from './bfs';
import { MinHeap } from './minHeap';

const DIRS: [number, number][] = [
  [-1, 0],
  [1,  0],
  [0, -1],
  [0,  1],
];

export function dijkstra(
  grid: GridNode[][],
  start: Position,
  end: Position,
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const key = (p: Position) => `${p.row}-${p.col}`;

  const dist = new Map<string, number>();
  const prev = new Map<string, Position | null>();
  const settled = new Set<string>();
  const visitedOrder: Position[] = [];
  const heap = new MinHeap();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dist.set(`${r}-${c}`, Infinity);
    }
  }

  dist.set(key(start), 0);
  prev.set(key(start), null);
  heap.push({ pos: start, dist: 0 });

  let found = false;

  while (heap.size > 0) {
    const { pos: current, dist: currentDist } = heap.pop()!;
    const currentKey = key(current);

    if (settled.has(currentKey)) continue;
    settled.add(currentKey);

    const isStart = current.row === start.row && current.col === start.col;
    const isEnd   = current.row === end.row   && current.col === end.col;

    if (!isStart && !isEnd) visitedOrder.push(current);

    if (isEnd) {
      found = true;
      break;
    }

    for (const [dr, dc] of DIRS) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const neighbor = grid[nr][nc];
      if (neighbor.type === 'wall') continue;

      const nPos: Position = { row: nr, col: nc };
      const nKey = key(nPos);

      if (settled.has(nKey)) continue;

      const edgeCost = neighbor.type === 'weight' ? WEIGHT_COST : 1;
      const newDist  = currentDist + edgeCost;

      if (newDist < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, newDist);
        prev.set(nKey, current);
        heap.push({ pos: nPos, dist: newDist });
      }
    }
  }

  const path: Position[] = [];

  if (found) {
    let curr: Position | null = end;

    while (curr !== null) {
      path.unshift(curr);
      const p = prev.get(key(curr));
      if (p === undefined) break;
      curr = p;
    }

    path.shift();
    path.pop();
  }

  return { visitedOrder, path, found };
}
