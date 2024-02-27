import { createSlice } from '@reduxjs/toolkit';
import { Party, Users } from '@heroiclabs/nakama-js';

const initialState: {
  data: Party | null;
  membersAccount: Users['users'] | [];
} = {
  data: null,
  membersAccount: [],
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParty(state, action) {
      state.data = action.payload;
    },
    setPartyMembersAccount(state, action) {
      state.membersAccount = action.payload;
    },
  },
});

export const { setParty, setPartyMembersAccount } = partySlice.actions;

export default partySlice.reducer;
