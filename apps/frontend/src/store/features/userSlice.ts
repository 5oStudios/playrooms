import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@heroiclabs/nakama-js';
// const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
// const refresh = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);
//
//
const initialState: User | null = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser } = userSlice.actions;
