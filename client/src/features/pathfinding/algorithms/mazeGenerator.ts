import type { Position } from '../types';

export function getMazeBounds(rows: number, cols: number) {
  const cellRows = Math.floor((rows - 1) / 2);
  const cellCols = Math.floor((cols - 1) / 2);
  const start: Position = { row: 1, col: 1 };
  const end: Position   = { row: 2 * (cellRows - 1) + 1, col: 2 * (cellCols - 1) + 1 };
  return { cellRows, cellCols, start, end };
}

export function recursiveBacktracking(rows: number, cols: number): Position[] {
  const { cellRows, cellCols } = getMazeBounds(rows, cols);

  const toReal = (r: number, c: number): Position => ({
    row: 2 * r + 1,
    col: 2 * c + 1,
  });

  const wallBetween = (r1: number, c1: number, r2: number, c2: number): Position => ({
    row: 2 * r1 + 1 + (r2 - r1),
    col: 2 * c1 + 1 + (c2 - c1),
  });

  const key = (r: number, c: number) => `${r},${c}`;
  const visited = new Set<string>();
  const carveOrder: Position[] = [];

  const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const stack: [number, number][] = [[0, 0]];
  visited.add(key(0, 0));
  carveOrder.push(toReal(0, 0));

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];

    const unvisited: [number, number][] = [];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < cellRows && nc >= 0 && nc < cellCols && !visited.has(key(nr, nc))) {
        unvisited.push([nr, nc]);
      }
    }

    if (unvisited.length > 0) {
      const idx = Math.floor(Math.random() * unvisited.length);
      const [nr, nc] = unvisited[idx];

      visited.add(key(nr, nc));
      carveOrder.push(wallBetween(r, c, nr, nc));
      carveOrder.push(toReal(nr, nc));
      stack.push([nr, nc]);
    } else {
      stack.pop();
    }
  }

  return carveOrder;
}
