import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GridNode, AlgorithmType, SpeedType, Position, DrawMode, RunStats } from './types';
import { ROWS, COLS, DEFAULT_START, DEFAULT_END, createGrid } from './utils';

interface PathfindingState {
  grid: GridNode[][];
  startNode: Position;
  endNode: Position;
  algorithm: AlgorithmType;
  speed: SpeedType;
  drawMode: DrawMode;
  isRunning: boolean;
  isFinished: boolean;
  isGeneratingMaze: boolean;
  stats: RunStats | null;
  rows: number;
  cols: number;
  // Playback
  visitedOrder: Position[] | null;
  pathPositions: Position[] | null;
  baseGrid: GridNode[][] | null;
  currentFrame: number;
  totalFrames: number;
}

const initialState: PathfindingState = {
  grid: createGrid(ROWS, COLS, DEFAULT_START, DEFAULT_END),
  startNode: { ...DEFAULT_START },
  endNode: { ...DEFAULT_END },
  algorithm: 'bfs',
  speed: 'medium',
  drawMode: 'wall',
  isRunning: false,
  isFinished: false,
  isGeneratingMaze: false,
  stats: null,
  rows: ROWS,
  cols: COLS,
  visitedOrder: null,
  pathPositions: null,
  baseGrid: null,
  currentFrame: 0,
  totalFrames: 0,
};

const pathfindingSlice = createSlice({
  name: 'pathfinding',
  initialState,
  reducers: {
    toggleWall(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      const node = state.grid[row][col];
      if (node.type === 'start' || node.type === 'end') return;
      node.type = node.type === 'wall' ? 'empty' : 'wall';
    },

    toggleWeight(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      const node = state.grid[row][col];
      if (node.type === 'start' || node.type === 'end') return;
      node.type = node.type === 'weight' ? 'empty' : 'weight';
    },

    setStartNode(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      if (state.grid[row][col].type === 'end') return;
      state.grid[state.startNode.row][state.startNode.col].type = 'empty';
      state.grid[row][col].type = 'start';
      state.startNode = action.payload;
    },

    setEndNode(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      if (state.grid[row][col].type === 'start') return;
      state.grid[state.endNode.row][state.endNode.col].type = 'empty';
      state.grid[row][col].type = 'end';
      state.endNode = action.payload;
    },

    setAlgorithm(state, action: PayloadAction<AlgorithmType>) {
      state.algorithm = action.payload;
    },

    setSpeed(state, action: PayloadAction<SpeedType>) {
      state.speed = action.payload;
    },

    setDrawMode(state, action: PayloadAction<DrawMode>) {
      state.drawMode = action.payload;
    },

    setRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },

    setFinished(state, action: PayloadAction<boolean>) {
      state.isFinished = action.payload;
    },

    setGeneratingMaze(state, action: PayloadAction<boolean>) {
      state.isGeneratingMaze = action.payload;
    },

    setStats(state, action: PayloadAction<RunStats | null>) {
      state.stats = action.payload;
    },

    markVisited(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      const node = state.grid[row][col];
      if (node.type !== 'start' && node.type !== 'end') {
        node.type = 'visited';
      }
    },

    markPath(state, action: PayloadAction<Position>) {
      const { row, col } = action.payload;
      const node = state.grid[row][col];
      if (node.type !== 'start' && node.type !== 'end') {
        node.type = 'path';
      }
    },

    fillWithWalls(state) {
      for (const row of state.grid) {
        for (const node of row) {
          if (node.type !== 'start' && node.type !== 'end') {
            node.type = 'wall';
          }
        }
      }
      state.isFinished = false;
      state.stats = null;
    },

    clearWalls(state) {
      for (const row of state.grid) {
        for (const node of row) {
          if (node.type === 'wall' || node.type === 'weight') node.type = 'empty';
        }
      }
    },

    resetVisualization(state) {
      for (const row of state.grid) {
        for (const node of row) {
          if (node.type === 'visited' || node.type === 'path') {
            node.type = 'empty';
          }
        }
      }
      state.isRunning = false;
      state.isFinished = false;
      state.stats = null;
      state.visitedOrder = null;
      state.pathPositions = null;
      state.baseGrid = null;
      state.currentFrame = 0;
      state.totalFrames = 0;
    },

    resetBoard(state) {
      state.grid = createGrid(state.rows, state.cols, state.startNode, state.endNode);
      state.isRunning = false;
      state.isFinished = false;
      state.stats = null;
      state.visitedOrder = null;
      state.pathPositions = null;
      state.baseGrid = null;
      state.currentFrame = 0;
      state.totalFrames = 0;
    },

    storeRunResult(
      state,
      action: PayloadAction<{
        visitedOrder: Position[];
        pathPositions: Position[];
        baseGrid: GridNode[][];
      }>
    ) {
      const { visitedOrder, pathPositions, baseGrid } = action.payload;
      state.visitedOrder = visitedOrder;
      state.pathPositions = pathPositions;
      state.baseGrid = baseGrid;
      state.totalFrames = visitedOrder.length + pathPositions.length;
      state.currentFrame = state.totalFrames - 1;
    },

    seekToFrame(state, action: PayloadAction<number>) {
      if (!state.baseGrid || !state.visitedOrder || !state.pathPositions) return;
      const f = Math.max(0, Math.min(action.payload, state.totalFrames - 1));
      state.currentFrame = f;

      // Rebuild grid from snapshot
      state.grid = state.baseGrid.map(row => row.map(node => ({ ...node })));

      // Apply visited nodes
      const vCount = Math.min(f + 1, state.visitedOrder.length);
      for (let i = 0; i < vCount; i++) {
        const { row, col } = state.visitedOrder[i];
        const node = state.grid[row][col];
        if (node.type !== 'start' && node.type !== 'end') node.type = 'visited';
      }

      // Apply path nodes (only after all visited nodes are shown)
      if (f >= state.visitedOrder.length) {
        const pCount = f - state.visitedOrder.length + 1;
        for (let i = 0; i < Math.min(pCount, state.pathPositions.length); i++) {
          const { row, col } = state.pathPositions[i];
          const node = state.grid[row][col];
          if (node.type !== 'start' && node.type !== 'end') node.type = 'path';
        }
      }
    },
  },
});

export const {
  fillWithWalls,
  toggleWall,
  toggleWeight,
  setStartNode,
  setEndNode,
  setAlgorithm,
  setSpeed,
  setDrawMode,
  setRunning,
  setFinished,
  setGeneratingMaze,
  setStats,
  markVisited,
  markPath,
  clearWalls,
  resetVisualization,
  resetBoard,
  storeRunResult,
  seekToFrame,
} = pathfindingSlice.actions;

export default pathfindingSlice.reducer;
