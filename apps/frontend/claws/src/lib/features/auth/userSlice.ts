import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { gameClient } from '@kingo/game-client';

import { envSchema } from '../../../env';
import { startAppListening } from '../../listenerMiddleware';
import { User } from './types';

export const verifySession = createAsyncThunk(
  'user/verifySession',
  async () => {
    const url = new URL(envSchema.NEXT_PUBLIC_BACKEND_URL);
    url.pathname = '/auth/userinfo';
    const response = await axios.get(url.toString(), { withCredentials: true });
    return response.data;
  },
);

interface UserState {
  user: User | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifySession.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(verifySession.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
    });
    builder.addCase(verifySession.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message ?? 'An error occurred';
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;

startAppListening({
  actionCreator: verifySession.fulfilled,
  effect: async (action, listenerApi) => {
    gameClient.auth.token = action.payload.id;
    console.log('User token:', action.payload);
  },
});
