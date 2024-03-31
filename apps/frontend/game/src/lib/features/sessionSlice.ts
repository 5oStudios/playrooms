'use client';

import { Session } from '@heroiclabs/nakama-js';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
  gameClient,
  gameSocket,
} from '@kingo/game-client';

import { storage } from '../../utils/storage';
import { startAppListening } from '../listenerMiddleware';
import { setAccount } from './accountSlice';
import { SocketState, setSocket } from './socketSlice';

const initialState: Session | null = null;

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      return action.payload;
    },
  },
  selectors: {
    selectSession: (state) => state,
    selectUserId: (state) => state?.user_id,
  },
});
export default sessionSlice.reducer;
export const { setSession } = sessionSlice.actions;
export const { selectSession, selectUserId } = sessionSlice.selectors;

startAppListening({
  actionCreator: setSession,
  effect: async (action, listenerApi) => {
    const session = action.payload;
    if (session) {
      storage.setItem({
        key: LOCAL_STORAGE_AUTH_KEY,
        value: session.token,
      });
      storage.setItem({
        key: LOCAL_STORAGE_REFRESH_KEY,
        value: session.refresh_token,
      });

      gameClient
        .getAccount(session)
        .then((account) => listenerApi.dispatch(setAccount(account)))
        .catch((error) => {
          console.error('Error fetching account: ', error.message);
        });

      gameSocket
        .connect(session, true)
        .then(() => {
          listenerApi.dispatch(setSocket(SocketState.CONNECTED));
          console.log('Connected to socket');
        })
        .catch((error) => {
          console.error('Error connecting to socket: ', error.message);
          listenerApi.dispatch(setSocket(SocketState.DISCONNECTED));
        });
    } else {
      gameSocket.disconnect(true);
      listenerApi.dispatch(setSocket(SocketState.DISCONNECTED));
    }
  },
});
