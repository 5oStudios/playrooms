import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { nakamaSocket } from '../../clients/nakama';
import { Party } from '@heroiclabs/nakama-js';

const initialState: Party = {
  party_id: null,
  open: false,
  leader: null,
  self: null,
  presences: [],
  max_size: 0,
};

const partySlice = createSlice({
  name: 'party',
  initialState: initialState,
  reducers: {
    successCreateParty(state, action: PayloadAction<Party>) {
      return action.payload;
    },
    joinParty(state, action: PayloadAction<string>) {
      // Add logic to join party
    },
    leaveParty(state) {
      return initialState; // Reset party state on leaving
    },
    promoteMember(state, action: PayloadAction<string>) {
      // Add logic to promote member to leader
    },
  },
});

export const { successCreateParty, joinParty, leaveParty, promoteMember } =
  partySlice.actions;

export default partySlice.reducer;

export const initializeSocket = (): ThunkAction<void, RootState, void, any> => {
  return async (dispatch, getState) => {
    const session = getState().auth.session;
    if (session) {
      try {
        await nakamaSocket.connect(session, true);
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    }
  };
};

export const createParty =
  ({
    open,
    maxPlayers,
  }: {
    open: boolean;
    maxPlayers: number;
  }): ThunkAction<void, RootState, any, any> =>
  async (dispatch, getState) => {
    if (getState().party.party_id) {
      console.error('Already in a party');
      return;
    }
    try {
      const partyData = await nakamaSocket.createParty(open, maxPlayers);
      dispatch(successCreateParty(partyData));
    } catch (error) {
      console.error('Failed to create party:', error);
    }
  };
