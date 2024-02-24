'use client';
import { configureStore } from '@reduxjs/toolkit';
import platformSlice from './features/platformSlice';
import playerSlice from './features/playersSlice';
import authSlice from './features/authSlice';
import partySlice from './features/partySlice';
import { generateUsername } from 'unique-username-generator';
import { genConfig } from 'react-nice-avatar';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    player: playerSlice,
    auth: authSlice,
    party: partySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {
    player: {
      username: generateUsername('', 0, 8, ''),
      avatarConfig: genConfig(),
    },
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// store.subscribe(() => {
//   initializeAuth()(store.dispatch, store.getState, null);
// });
// store.dispatch(initializeSocket());
