import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerScoreAction } from '../../hooks/use-player';

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

const initialState: {
  myPlayer: Player;
  otherPlayers: Player[];
} = {
  myPlayer: null,
  otherPlayers: [],
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerState(state, action: PayloadAction<PlayerState>) {
      state.myPlayer.state = action.payload;
    },
    setPlayerScore(
      state,
      action: PayloadAction<{
        points: number;
        action: PlayerScoreAction;
      }>
    ) {
      state.myPlayer.score =
        action.payload.action === PlayerScoreAction.ADD
          ? state.myPlayer.score + action.payload.points
          : state.myPlayer.score - action.payload.points;
    },
    setMyPlayer(state, action: PayloadAction<Player>) {
      state.myPlayer = action.payload;
    },
    setOtherPlayersScore(
      state,
      action: PayloadAction<{
        id: string;
        points: number;
        action: PlayerScoreAction;
      }>
    ) {
      const player = state.otherPlayers.find((p) => p.id === action.payload.id);
      if (player) {
        player.score =
          action.payload.action === PlayerScoreAction.ADD
            ? player.score + action.payload.points
            : player.score - action.payload.points;
      }
    },
    addOtherPlayer(state, action: PayloadAction<Player>) {
      state.otherPlayers.push(action.payload);
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
  setMyPlayer,
  addOtherPlayer,
  removeOtherPlayer,
} = playersSlice.actions;
