import { configureStore } from '@reduxjs/toolkit';
import platformSlice from './features/platformSlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
