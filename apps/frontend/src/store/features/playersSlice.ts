import { createSlice } from '@reduxjs/toolkit';

const player = createSlice({
  name: 'player',
  initialState: {
    username: '',
    avatarConfig: {},
  },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setAvatarConfig(state, action) {
      state.avatarConfig = action.payload;
    },
  },
});

export default player.reducer;

export const { setUsername, setAvatarConfig } = player.actions;
