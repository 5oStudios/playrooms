import { createSlice } from '@reduxjs/toolkit';
import { Match } from '@heroiclabs/nakama-js';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';

enum MatchState {
  LOADING = 'LOADING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  ERROR = 'ERROR',
}

const initialState: {
  currentMatch: Match | null;
  currentMatchState: MatchState;
  matchFoundData: MatchmakerMatched | null;
  isHostForCurrentMatch: boolean;
} = {
  currentMatch: null,
  currentMatchState: MatchState.LOADING,
  matchFoundData: null,
  isHostForCurrentMatch: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setCurrentMatch(state, action) {
      state.currentMatch = action.payload;
    },
    setMatchState(state, action) {
      state.currentMatchState = action.payload;
    },
    setMatchHost(state, action) {
      state.isHostForCurrentMatch = action.payload;
    },
    setMatchFoundData(state, action) {
      state.matchFoundData = action.payload;
    },
  },
});

export const {
  setCurrentMatch,
  setMatchState,
  setMatchHost,
  setMatchFoundData,
} = matchSlice.actions;

export default matchSlice.reducer;
