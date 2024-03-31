import { User } from '@heroiclabs/nakama-js';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
// const refresh = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);
//
//

// const initialState: User | null = {
//   username: generatedUsername,
//   avatar_url: parsedAvatarConfig,
// };

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser } = userSlice.actions;
