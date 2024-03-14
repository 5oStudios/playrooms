import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  PLAYING = 'PLAYING',
}

const initialState: {
  myPlayer: { state: PlayerState; score: number };
  otherPlayers: { id: string; username: string; score: number }[];
} = {
  myPlayer: { state: PlayerState.NOT_READY, score: 0 },
  otherPlayers: [],
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerState(state, action: PayloadAction<PlayerState>) {
      state.myPlayer.state = action.payload;
    },
    setPlayerScore(state, action: PayloadAction<number>) {
      state.myPlayer.score = action.payload;
    },
    setOtherPlayersScore(
      state,
      action: PayloadAction<{ id: string; score: number }>
    ) {
      const player = state.otherPlayers.find((p) => p.id === action.payload.id);
      if (player) {
        player.score = action.payload.score;
      }
    },
    addOtherPlayer(
      state,
      action: PayloadAction<{ id: string; username: string }>
    ) {
      state.otherPlayers.push({ ...action.payload, score: 0 });
    },
    removeOtherPlayer(state, action: PayloadAction<string>) {
      state.otherPlayers = state.otherPlayers.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});
export default playersSlice.reducer;

export const {
  setPlayerState,
  setPlayerScore,
  setOtherPlayersScore,
  addOtherPlayer,
  removeOtherPlayer,
} = playersSlice.actions;
