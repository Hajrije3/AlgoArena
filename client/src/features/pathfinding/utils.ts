import type { GridNode, NodeType, Position } from './types';

export const ROWS = 20;
export const COLS = 50;
export const DEFAULT_START: Position = { row: 10, col: 10 };
export const DEFAULT_END: Position = { row: 10, col: 40 };

function resolveType(
  row: number,
  col: number,
  start: Position,
  end: Position,
  walls: Set<string>,
): NodeType {
  if (row === start.row && col === start.col) return 'start';
  if (row === end.row && col === end.col) return 'end';
  if (walls.has(`${row}-${col}`)) return 'wall';
  return 'empty';
}

export function createGrid(
  rows: number,
  cols: number,
  start: Position,
  end: Position,
  walls: Set<string> = new Set(),
): GridNode[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      type: resolveType(row, col, start, end, walls),
    })),
  );
}

export function posKey(pos: Position): string {
  return `${pos.row}-${pos.col}`;
}
