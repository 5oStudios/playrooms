'use client';

import { Session } from '@heroiclabs/nakama-js';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
