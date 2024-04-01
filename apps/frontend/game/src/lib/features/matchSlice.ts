import { Match, Presence } from '@heroiclabs/nakama-js';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';
import { createSlice } from '@reduxjs/toolkit';

import { gameSocket } from '@kingo/game-client';

import { SOCKET_OP_CODES } from '../../hooks/match';
import { HostState } from '../../hooks/use-host';
import { startAppListening } from '../listenerMiddleware';

export enum MatchState {
  LOADING = 'LOADING',
  READY = 'READY',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  NOT_FOUND = 'NOT_FOUND',
}

const initialState: {
  currentMatch: Match | null;
  currentMatchState: MatchState;
  matchFoundData: MatchmakerMatched | null;
  amIHost: boolean;
  hostState: HostState;

  match: Match | null;
  host: Presence | null;
} = {
  currentMatch: null,
  currentMatchState: null,
  matchFoundData: null,
  amIHost: null,
  hostState: null,

  match: null,
  host: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setMatch(state, action) {
      state.match = action.payload;
      const amIFirstPlayer = state.match?.presences.length === 0;
      if (amIFirstPlayer) {
        state.amIHost = true;
        state.hostState = HostState.ELECTED;
        state.host = state.match.self;
      }
    },
    setHost(state, action) {
      state.host = action.payload;
    },

    setCurrentMatch(state, action) {
      state.currentMatch = action.payload;
    },
    setCurrentMatchState(state, action) {
      state.currentMatchState = action.payload;
    },
    setAmIHost(state, action) {
      state.amIHost = action.payload;
    },
    setMatchFoundData(state, action) {
      state.matchFoundData = action.payload;
    },
    setHostState(state, action) {
      state.hostState = action.payload;
    },
  },
  selectors: {
    selectCurrentMatch: (state) => state.currentMatch,
    selectCurrentMatchState: (state) => state.currentMatchState,
    selectMatchFoundData: (state) => state.matchFoundData,
    selectHostState: (state) => state.hostState,

    selectAmIHost: (state) => state.amIHost,
    selectMatch: (state) => state.match,
    selectHost: (state) => state.host,
  },
});

export const {
  setCurrentMatch,
  setCurrentMatchState,
  setAmIHost,
  setMatchFoundData,
  setHostState,

  setMatch,
  setHost,
} = matchSlice.actions;

export const {
  selectCurrentMatch,
  selectCurrentMatchState,
  selectMatchFoundData,
  selectHostState,

  selectAmIHost,
  selectMatch,
  selectHost,
} = matchSlice.selectors;

export default matchSlice.reducer;

startAppListening({
  actionCreator: setCurrentMatchState,
  effect: async (action, listenerApi) => {
    const amIHost = listenerApi.getState().match.amIHost;
    if (!amIHost) return;

    const matchId = listenerApi.getState().match.match?.match_id;

    gameSocket
      .sendMatchState(matchId, SOCKET_OP_CODES.HOST_STATE, action.payload)
      .then(() => {
        console.log('Match state sent', action.payload);
      })
      .catch((error) => {
        console.error('Error sending match state: ', error.message);
      });
  },
});
