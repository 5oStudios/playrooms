import { createSlice } from '@reduxjs/toolkit';

export enum SocketState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

const socketSlice = createSlice({
  name: 'socket',
  initialState: SocketState.DISCONNECTED,
  reducers: {
    setSocket: (state, action: { payload: SocketState }) => {
      return action.payload;
    },
  },
});

export default socketSlice.reducer;

export const { setSocket } = socketSlice.actions;
