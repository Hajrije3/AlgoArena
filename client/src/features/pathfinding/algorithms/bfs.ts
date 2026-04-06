import type { GridNode, Position } from '../types';

export interface AlgorithmResult {
  visitedOrder: Position[];
  path: Position[];
  found: boolean;
}

const DIRS: [number, number][] = [
  [-1, 0],
  [1,  0],
  [0, -1],
  [0,  1],
];

export function bfs(
  grid: GridNode[][],
  start: Position,
  end: Position,
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;
  const key = (p: Position) => `${p.row}-${p.col}`;

  const visited = new Set<string>();
  const prev = new Map<string, Position | null>();
  const queue: Position[] = [];
  const visitedOrder: Position[] = [];

  visited.add(key(start));
  prev.set(key(start), null);
  queue.push(start);

  let found = false;

  outer: while (queue.length > 0) {
    const current = queue.shift()!;
    const isStart = current.row === start.row && current.col === start.col;
    const isEnd   = current.row === end.row   && current.col === end.col;

    if (!isStart && !isEnd) visitedOrder.push(current);

    if (isEnd) {
      found = true;
      break outer;
    }

    for (const [dr, dc] of DIRS) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc].type === 'wall') continue;

      const neighbor: Position = { row: nr, col: nc };
      const nKey = key(neighbor);

      if (!visited.has(nKey)) {
        visited.add(nKey);
        prev.set(nKey, current);
        queue.push(neighbor);
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
