import { createSlice } from '@reduxjs/toolkit';
import { Party } from '@heroiclabs/nakama-js';

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
