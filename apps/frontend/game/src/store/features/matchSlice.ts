import { Match } from '@heroiclabs/nakama-js';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';
import { createSlice } from '@reduxjs/toolkit';

import { HostState } from '../../hooks/use-host';

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
} = {
  currentMatch: null,
  currentMatchState: null,
  matchFoundData: null,
  amIHost: null,
  hostState: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
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
});

export const {
  setCurrentMatch,
  setCurrentMatchState,
  setAmIHost,
  setMatchFoundData,
  setHostState,
} = matchSlice.actions;

export default matchSlice.reducer;
