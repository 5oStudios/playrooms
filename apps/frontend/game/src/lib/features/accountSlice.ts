import { ApiAccount } from '@heroiclabs/nakama-js/dist/api.gen';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { gameClient } from '@kingo/game-client';

import { startAppListening } from '../listenerMiddleware';

const initialState: ApiAccount | null = null;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<ApiAccount>) {
      return action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.user.username = action.payload;
    },
  },
  selectors: {
    selectUserId: (state) => state?.user.id,
    selectUser: (state) => state?.user,
    selectAvatarUrl: (state) => state?.user.avatar_url,
  },
});

export const accountReducer = accountSlice.reducer;

export const { setAccount, setUsername } = accountSlice.actions;

export const { selectUserId, selectUser, selectAvatarUrl } =
  accountSlice.selectors;

startAppListening({
  actionCreator: setUsername,
  effect: async (action, listenerApi) => {
    const username = action.payload;
    const session = listenerApi.getState().session;

    if (session) {
      gameClient.updateAccount(session, { username }).catch((error) => {
        console.error('Error updating account: ', error.message);
      });
    }
  },
});
