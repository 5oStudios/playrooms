import { configureStore } from '@reduxjs/toolkit';
import platformSlice from './features/platformSlice';
import partySlice from './features/partySlice';
import playerSlice from './features/playerSlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    player: playerSlice,
    party: partySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
