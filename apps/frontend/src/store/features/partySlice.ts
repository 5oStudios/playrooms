import { createSlice } from '@reduxjs/toolkit';
import { Party, Users } from '@heroiclabs/nakama-js';

const initialState: {
  data: Party | null;
  membersAccount: Users | null;
} = {
  data: null,
  membersAccount: null,
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParty(state, action) {
      state.data = action.payload;
    },
    setMembersAccount(state, action) {
      state.membersAccount = action.payload;
    },
  },
});

export const { setParty, setMembersAccount } = partySlice.actions;

export default partySlice.reducer;
