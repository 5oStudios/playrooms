import { configureStore } from '@reduxjs/toolkit';
import platformSlice from './features/platformSlice';
import playersSlice from './features/playersSlice';
import authSlice, { initializeAuth } from './features/authSlice';
import partySlice, { initializeSocket } from './features/partySlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    players: playersSlice,
    auth: authSlice,
    party: partySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
store.dispatch(initializeAuth());
store.dispatch(initializeSocket());
