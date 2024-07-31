import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RoomAvailable } from 'colyseus.js';

import { gameClient } from '@kingo/game-client';

export const getAvailableRooms = createAsyncThunk(
  'rooms/getAvailableRooms',
  async () => {
    return await gameClient.getAvailableRooms();
  },
);

const initialState: {
  availableRooms: RoomAvailable[];
  state: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
} = {
  availableRooms: [],
  state: 'idle',
  error: null,
};

export const roomsSlice = createSlice({
  name: 'roomsSlice',
  initialState,
  reducers: {
    setRooms(state, action) {
      state.availableRooms = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAvailableRooms.fulfilled, (state, action) => {
      state.availableRooms = action.payload;
      state.state = 'succeeded';
    });
    builder.addCase(getAvailableRooms.rejected, (state, action) => {
      state.error = action.error.message ?? 'An error occurred';
      state.state = 'failed';
    });
    builder.addCase(getAvailableRooms.pending, (state) => {
      state.state = 'loading';
    });
  },
});
