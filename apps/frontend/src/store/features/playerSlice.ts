import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  PLAYING = 'PLAYING',
}

const initialState = {
  myPlayerState: PlayerState.NOT_READY,
};
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setMyPlayerState(state, action: PayloadAction<PlayerState>) {
      state.myPlayerState = action.payload;
    },
  },
});
export default playerSlice.reducer;

export const { setMyPlayerState } = playerSlice.actions;
