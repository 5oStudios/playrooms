import { createSlice } from '@reduxjs/toolkit';
import { Socket } from '@heroiclabs/nakama-js';

const initialState: Socket = null;

const gameSocketSlice = createSlice({
  name: 'gameSocket',
  initialState,
  reducers: {
    setGameSocket(state, action) {
      return action.payload;
    },
  },
});

export const { setGameSocket } = gameSocketSlice.actions;

export default gameSocketSlice.reducer;
