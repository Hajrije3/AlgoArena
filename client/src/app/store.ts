import { configureStore } from '@reduxjs/toolkit';
import pathfindingReducer from '@/features/pathfinding/pathfindingSlice';
import sortingReducer     from '@/features/sorting/sortingSlice';

export const store = configureStore({
  reducer: {
    pathfinding: pathfindingReducer,
    sorting:     sortingReducer,
  },
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
