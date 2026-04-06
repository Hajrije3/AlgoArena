export type NodeType = 'empty' | 'start' | 'end' | 'wall' | 'weight' | 'visited' | 'path';
export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar';
export type SpeedType = 'slow' | 'medium' | 'fast';
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

export const SPEED_DELAY_MS: Record<SpeedType, number> = {
  slow: 80,
  medium: 25,
  fast: 5,
};
