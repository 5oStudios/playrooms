import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { gameClient } from '@kingo/game-client';

export const fetchRooms = createAsyncThunk(
  'baseRoom/fetchRooms',
  async () => await gameClient.getAvailableRooms(),
);

export const baseRoomSlice = createSlice({
  name: 'baseRoom',
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
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.room = action.payload;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});
