import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Session } from '@heroiclabs/nakama-js';
import { nakamaClient, NakamaClient } from '../../clients/nakama';

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
      // Save session in local storage
      localStorage.setItem('session', JSON.stringify(action.payload));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.session = null;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.session = null;
      state.error = null;
      // Clear session from local storage
      localStorage.removeItem('session');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

const { loginSuccess, loginFailure, logoutSuccess, clearError } =
  authSlice.actions;

export default authSlice.reducer;

// Thunks for async actions
export const authenticateEmail =
  (
    email: string,
    password: string
  ): ThunkAction<void, RootState, NakamaClient, any> =>
  async (dispatch, _, nakamaClient) => {
    try {
      const session: Session = await nakamaClient.authenticateEmail(
        email,
        password
      );
      dispatch(loginSuccess(session));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

export const authenticateDevice =
  ({
    deviceId,
    create,
    username,
    vars,
  }: {
    deviceId: string;
    create?: boolean;
    username?: string;
    vars?: Record<string, string>;
  }): ThunkAction<void, RootState, NakamaClient, any> =>
  async (dispatch, action) => {
    try {
      const session: Session = await nakamaClient.authenticateDevice(
        deviceId,
        create,
        username,
        vars
      );
      dispatch(loginSuccess(session));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

export const initializeAuth =
  (): ThunkAction<void, RootState, NakamaClient, any> =>
  async (dispatch, getState, nakamaClient) => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const session: Session = JSON.parse(storedSession);
      dispatch(loginSuccess(session));
    } else {
      console.log('No session found in local storage');
    }
  };
