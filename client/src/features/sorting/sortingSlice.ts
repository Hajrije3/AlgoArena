import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AnimFrame, SortAlgorithm, SortSpeed } from './types';
import { BAR_COUNT, BAR_MIN, BAR_MAX } from './types';

interface SortingState {
  values:    number[];
  comparing: number[];
  swapping:  number[];
  sorted:    number[];
  algorithm: SortAlgorithm;
  speed:     SortSpeed;
  isRunning: boolean;
  isComplete: boolean;
  barCount:  number;
}

function generateValues(count: number): number[] {
  return Array.from({ length: count }, () =>
    BAR_MIN + Math.floor(Math.random() * (BAR_MAX - BAR_MIN + 1)),
  );
}

const initialState: SortingState = {
  values:     generateValues(BAR_COUNT),
  comparing:  [],
  swapping:   [],
  sorted:     [],
  algorithm:  'bubble',
  speed:      'medium',
  isRunning:  false,
  isComplete: false,
  barCount:   BAR_COUNT,
};

const sortingSlice = createSlice({
  name: 'sorting',
  initialState,
  reducers: {
    shuffleBars(state, action: PayloadAction<number[]>) {
      state.values    = action.payload;
      state.comparing = [];
      state.swapping  = [];
      state.sorted    = [];
      state.isRunning  = false;
      state.isComplete = false;
    },

    applyFrame(state, action: PayloadAction<AnimFrame>) {
      const { values, comparing, swapping, sorted } = action.payload;
      state.values    = values;
      state.comparing = comparing;
      state.swapping  = swapping;
      state.sorted    = sorted;
    },

    setAlgorithm(state, action: PayloadAction<SortAlgorithm>) {
      state.algorithm = action.payload;
    },

    setSpeed(state, action: PayloadAction<SortSpeed>) {
      state.speed = action.payload;
    },

    setRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },

    setComplete(state, action: PayloadAction<boolean>) {
      state.isComplete = action.payload;
    },
  },
});

export const {
  shuffleBars,
  applyFrame,
  setAlgorithm,
  setSpeed,
  setRunning,
  setComplete,
} = sortingSlice.actions;

export default sortingSlice.reducer;
