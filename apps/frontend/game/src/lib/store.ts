import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
  gameClient,
  gameSocket,
} from '@kingo/game-client';

import { storage } from '../utils/storage';
import externalChatSlice from './features/externalChatSlice';
import matchSlice from './features/matchSlice';
import partySlice from './features/partySlice';
import platformSlice from './features/platformSlice';
import playersSlice from './features/playersSlice';
import sessionSlice, { setSession } from './features/sessionSlice';
import socketSlice, { SocketState, setSocket } from './features/socketSlice';
import tournamentSlice from './features/tournamentSlice';
import userSlice, { setUser } from './features/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      platform: platformSlice,
      party: partySlice,

      players: playersSlice,
      tournament: tournamentSlice,
      externalChat: externalChatSlice,
      session: sessionSlice,
      user: userSlice,
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

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: setSession,
  effect: async (action, listenerApi) => {
    const session = action.payload;
    if (!session) return;

    storage.setItem({
      key: LOCAL_STORAGE_AUTH_KEY,
      value: session.token,
    });
    storage.setItem({
      key: LOCAL_STORAGE_REFRESH_KEY,
      value: session.refresh_token,
    });

    gameClient.getAccount(session).then((user) => {
      listenerApi.dispatch(setUser(user.user));
    });

    gameSocket
      .connect(session, true)
      .then(() => {
        makeStore().dispatch(setSocket(SocketState.CONNECTED));
        console.log('Connected to socket');
      })
      .catch((error) => {
        console.error('Error connecting to socket: ', error.message);
        makeStore().dispatch(setSocket(SocketState.DISCONNECTED));
      });
  },
});
