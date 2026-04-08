export type NodeType = 'empty' | 'start' | 'end' | 'wall' | 'weight' | 'visited' | 'path';
export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra';
export type SpeedType = number; // 1–7
export type DrawMode = 'wall' | 'weight';

export interface Position {
  row: number;
  col: number;
}

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
}

export const WEIGHT_COST = 5;

export interface RunStats {
  algorithm: AlgorithmType;
  visitedCount: number;
  pathLength: number;
  found: boolean;
}

export const PATH_BASE_MS = 40; // delay at 1×; divided by speed for higher multipliers
