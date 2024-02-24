import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Session } from '@heroiclabs/nakama-js';
import { gameClient } from '@core/game-client';

export const NAKAMA_SESSION_KEY = 'NAKAMA_SESSION_KEY';
interface AuthState {
  session: Session | null;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<Session>) {
      state.session = action.payload;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.session = null;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;

export const { loginSuccess, loginFailure } = authSlice.actions;

// Thunks for async actions
export const authenticateDevice =
  ({
    username,
    vars,
  }: {
    username: string;
    vars?: Record<string, string>;
  }): ThunkAction<void, RootState, any, any> =>
  async (dispatch, action) => {
    try {
      const session = await gameClient.authenticateDevice({
        username,
        vars,
      });
      dispatch(loginSuccess(session));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

export const initializeAuth =
  (): ThunkAction<void, RootState, any, any> =>
  async (dispatch, getState, nakamaClient) => {
    if (!localStorage)
      throw new Error('Local storage is not available in reducer');
    const session = gameClient.getSessionFromLocalStorage();
    if (session) {
      dispatch(loginSuccess(session));
    }
  };
