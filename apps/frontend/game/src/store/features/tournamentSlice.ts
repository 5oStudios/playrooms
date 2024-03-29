import { createSlice } from '@reduxjs/toolkit';

export interface TournamentFormData {
  questionsCollectionId: string;
  tournamentTitle: string;
  maxPlayers: string;
  externalPlatforms: {
    id: string;
    label: string;
    username: string;
  }[];
  allowThisPlatform: boolean;
}

const initialState: null | TournamentFormData = null;

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setTournamentFormData(state, action) {
      return action.payload;
    },
  },
});

export default tournamentSlice.reducer;

export const { setTournamentFormData } = tournamentSlice.actions;
