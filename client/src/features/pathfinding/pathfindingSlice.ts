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
    },

    resetBoard(state) {
      state.grid = createGrid(state.rows, state.cols, state.startNode, state.endNode);
      state.isRunning = false;
      state.isFinished = false;
      state.stats = null;
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
} = pathfindingSlice.actions;

export default pathfindingSlice.reducer;
