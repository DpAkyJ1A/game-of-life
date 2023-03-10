import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../features/border/boardSlice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
