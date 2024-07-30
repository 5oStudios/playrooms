import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { User } from './types';

export const verifySession = createAsyncThunk(
  'user/verifySession',
  async () => {
    const response = await axios.get('http://localhost:3000/auth/userinfo');
    return response.data;
  },
  // new Promise<User>((resolve, reject) => {
  //   signInAndUp()
  //     .then((response) => {
  //       if (response.status === 'OK') {
  //         resolve(response.user);
  //       }
  //       console.log(response.status);
  //       reject(response.status);
  //     })
  //     .catch((error) => {
  //       console.error('Oops! Something went wrong.', error);
  //       reject(error);
  //     });
  // }),
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
