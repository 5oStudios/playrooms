import { configureStore } from '@reduxjs/toolkit';
import platformSlice from './features/platformSlice';
import playersSlice from './features/playersSlice';
import authSlice, { initializeAuth } from './features/authSlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    players: playersSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
store.dispatch(initializeAuth());
