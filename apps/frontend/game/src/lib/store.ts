import { configureStore } from '@reduxjs/toolkit';

import { accountReducer } from './features/accountSlice';
import externalChatSlice from './features/externalChatSlice';
import matchSlice from './features/matchSlice';
import partySlice from './features/partySlice';
import platformSlice from './features/platformSlice';
import playersSlice from './features/playersSlice';
import sessionSlice from './features/sessionSlice';
import socketSlice from './features/socketSlice';
import tournamentSlice from './features/tournamentSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const makeStore = () => {
  return configureStore({
    reducer: {
      platform: platformSlice,
      party: partySlice,

      players: playersSlice,
      tournament: tournamentSlice,
      externalChat: externalChatSlice,
      session: sessionSlice,
      account: accountReducer,
      socket: socketSlice,
      match: matchSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(listenerMiddleware.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
