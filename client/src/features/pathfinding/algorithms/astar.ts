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


function h(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function astar(
  grid: GridNode[][],
  start: Position,
  end: Position,
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const key = (p: Position) => `${p.row}-${p.col}`;

  const gScore  = new Map<string, number>();
  const prev    = new Map<string, Position | null>();
  const settled = new Set<string>();
  const visitedOrder: Position[] = [];
  const heap = new MinHeap();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gScore.set(`${r}-${c}`, Infinity);
    }
  }

  const startKey = key(start);
  gScore.set(startKey, 0);
  prev.set(startKey, null);
  heap.push({ pos: start, dist: h(start, end) });

  let found = false;

  while (heap.size > 0) {
    const { pos: current } = heap.pop()!;
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

    const currentG = gScore.get(currentKey) ?? Infinity;

    for (const [dr, dc] of DIRS) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const neighbor = grid[nr][nc];
      if (neighbor.type === 'wall') continue;

      const nPos: Position = { row: nr, col: nc };
      const nKey = key(nPos);

      if (settled.has(nKey)) continue;

      const edgeCost    = neighbor.type === 'weight' ? WEIGHT_COST : 1;
      const tentativeG  = currentG + edgeCost;

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        gScore.set(nKey, tentativeG);
        prev.set(nKey, current);
        heap.push({ pos: nPos, dist: tentativeG + h(nPos, end) });
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
