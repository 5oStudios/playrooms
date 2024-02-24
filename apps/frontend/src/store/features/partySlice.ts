import { createSlice, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Party, Presence } from '@heroiclabs/nakama-js';
import { gameClient } from '@core/game-client';

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
  initialState,
  reducers: {
    setParty(state, action) {
      return action.payload;
    },
  },
});

export const { setParty } = partySlice.actions;

export default partySlice.reducer;

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
      const party = await gameClient.createParty(open, maxPlayers);
      dispatch(setParty(party));
    } catch (error) {
      console.error('Failed to create party:', error);
    }
  };

export const joinParty =
  (partyId: string): ThunkAction<void, RootState, any, any> =>
  async (dispatch, getState) => {
    try {
      const party = await gameClient.joinParty(partyId);
      dispatch(setParty(party));
    } catch (error) {
      console.error('Failed to join party:', error);
    }
  };

export const leaveParty =
  (): ThunkAction<void, RootState, any, any> => async (dispatch, getState) => {
    try {
      // const session = getState().auth.session;
      // const socket = nakamaClient.createSocket();
      // await socket.connect(session, true);
      // await socket.leaveParty(getState().party.party_id);
      // dispatch(onLeaveParty());
    } catch (error) {
      console.error('Failed to leave party:', error);
    }
  };

export const promoteMember =
  (partyMember: Presence): ThunkAction<void, RootState, any, any> =>
  async (dispatch, getState) => {
    try {
      // const session = getState().auth.session;
      // const socket = nakamaClient.createSocket();
      // await socket.connect(session, true);
      // const partyLeader = await socket.promotePartyMember(
      //   getState().party.party_id,
      //   partyMember
      // );
      //
      // dispatch(onPromoteMember(partyLeader));
    } catch (error) {
      console.error('Failed to promote member:', error);
    }
  };
