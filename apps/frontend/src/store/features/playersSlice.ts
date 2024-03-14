import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PlayerScoreAction {
  ADD = 'add',
  SUBTRACT = 'subtract',
}

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  PLAYING = 'PLAYING',
}

interface Player {
  id: string;
  username: string;
  score: number;
  state: PlayerState;
}
const initialState: Player[] = [];

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerState(
      state,
      action: PayloadAction<{
        id: string;
        state: PlayerState;
      }>
    ) {
      const player = state.find((p) => p.id === action.payload.id);
      console.log(
        'REDUX updating player state',
        player.username,
        action.payload.state
      );
      if (player) {
        player.state = action.payload.state;
      }
    },
    setPlayerScore(
      state,
      action: PayloadAction<{
        id: string;
        points: number;
        action: PlayerScoreAction;
      }>
    ) {
      const player = state.find((p) => p.id === action.payload.id);
      console.log(
        'REDUX updating player score',
        player.username,
        action.payload.points
      );
      if (player) {
        player.score =
          action.payload.action === PlayerScoreAction.ADD
            ? player.score + action.payload.points
            : player.score - action.payload.points;
      }
    },
    addPlayer(state, action: PayloadAction<Player>) {
      const isPlayerExist = state.find((p) => p.id === action.payload.id);
      console.log('REDUX adding player', action.payload.username);
      if (!isPlayerExist) {
        state.push(action.payload);
      }
    },
    removePlayer(state, action: PayloadAction<string>) {
      console.log('REDUX removing player', action.payload);
      return state.filter((p) => p.id !== action.payload);
    },
    clearPlayers() {
      console.log('REDUX clearing players');
      return [];
    },
  },
});
export default playersSlice.reducer;

export const {
  setPlayerState,
  setPlayerScore,
  addPlayer,
  removePlayer,
  clearPlayers,
} = playersSlice.actions;
