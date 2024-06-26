import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
  user_id: string;
  username: string;
  score: number;
  state: PlayerState;
  avatar_url?: string;
}

const initialState: Player[] = [];

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerState(
      state,
      action: PayloadAction<{
        user_id: string;
        state: PlayerState;
      }>,
    ) {
      const player = state.find((p) => p.user_id === action.payload.user_id);
      console.log(
        'REDUX updating player state',
        player?.username,
        action.payload.state,
      );
      if (player) {
        player.state = action.payload.state;
      }
    },
    addPlayerScore(
      state,
      action: PayloadAction<{
        user_id: string;
        score: number;
      }>,
    ) {
      const player = state.find((p) => p.user_id === action.payload.user_id);
      console.log(
        'REDUX updating player score',
        player?.username,
        action.payload.score,
      );
      if (player) {
        player.score += action.payload.score;
      }
    },
    subPlayerScore(
      state,
      action: PayloadAction<{
        user_id: string;
        score: number;
      }>,
    ) {
      const player = state.find((p) => p.user_id === action.payload.user_id);
      console.log(
        'REDUX updating player score',
        player?.username,
        action.payload.score,
      );
      if (player) {
        player.score -= action.payload.score;
      }
    },
    setPlayerScore(
      state,
      action: PayloadAction<{
        user_id: string;
        points: number;
        action: PlayerScoreAction;
      }>,
    ) {
      const player = state.find((p) => p.user_id === action.payload.user_id);
      console.log(
        'REDUX updating player score',
        player?.username,
        action.payload.points,
      );
      if (player) {
        if (action.payload.action === PlayerScoreAction.ADD) {
          player.score += action.payload.points;
        } else {
          player.score -= action.payload.points;
        }
      }
    },
    addPlayer(state, action: PayloadAction<Player>) {
      const isPlayerExist = state.find(
        (p) => p.user_id === action.payload.user_id,
      );
      console.log('REDUX adding player', action.payload.username);
      if (!isPlayerExist) {
        state.push(action.payload);
      }
    },
    removePlayer(state, action: PayloadAction<string>) {
      console.log('REDUX removing player', action.payload);
      return state.filter((p) => p.user_id !== action.payload);
    },
    clearPlayers(state) {
      console.log('REDUX clearing players');
      state.splice(0, state.length);
    },
  },
});

export default playersSlice.reducer;

export const {
  setPlayerState,
  addPlayer,
  removePlayer,
  clearPlayers,
  subPlayerScore,
  addPlayerScore,
  setPlayerScore,
} = playersSlice.actions;
