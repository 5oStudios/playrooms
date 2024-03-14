import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  PLAYING = 'PLAYING',
}

const initialState = {
  state: PlayerState.NOT_READY,
  score: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerState(state, action: PayloadAction<PlayerState>) {
      state.state = action.payload;
    },
    setPlayerScore(state, action: PayloadAction<number>) {
      state.score = action.payload;
    },
  },
});
export default playerSlice.reducer;

export const { setPlayerState, setPlayerScore } = playerSlice.actions;
