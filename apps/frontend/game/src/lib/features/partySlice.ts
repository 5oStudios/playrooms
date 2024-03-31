import { Party } from '@heroiclabs/nakama-js';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Party | null = null;

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParty(state, action) {
      return action.payload;
    },
  },
});

export const { setParty } = partySlice.actions;

export default partySlice.reducer;
