import { createSlice } from '@reduxjs/toolkit';

export const clawsRoomSlice = createSlice({
  name: 'clawsRoom',
  initialState: {
    room: null,
    error: null,
  },
  reducers: {
    setRoom(state, action) {
      state.room = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});
