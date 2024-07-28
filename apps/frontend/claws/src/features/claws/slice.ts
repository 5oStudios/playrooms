import { createSlice } from '@reduxjs/toolkit';

const ClawsRoomSlice = createSlice({
  name: 'clawsRoom',
  initialState: {
    room: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(setRoom, (state, action) => {
      state.room = action.payload;
    });
    builder.addCase(setError, (state, action) => {
      state.error = action.payload;
    });
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

export const { setRoom, setError } = ClawsRoomSlice.actions;
export const clawsRoomReducer = ClawsRoomSlice.reducer;
