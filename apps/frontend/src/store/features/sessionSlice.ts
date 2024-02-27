'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@heroiclabs/nakama-js';
// const generatedUsername = generateUsername('', 0, 8, '');
// const generatedAvatarConfig = JSON.stringify(genConfig());
// const currentDateInSeconds = Date.now() / 1000;
//
// const setTokens = (session: Session) => {
//   localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, session.token);
//   localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, session.refresh_token);
// };

// const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
// const refresh = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);

// const initialState: Session | null =
//   auth && refresh ? Session.restore(auth, refresh) : null;

const initialState: Session | null = null;

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      return action.payload;
    },
  },
});
export default sessionSlice.reducer;
export const { setSession } = sessionSlice.actions;

// Thunks for async actions
// export const authenticateDevice =
//   ({
//     username,
//     vars,
//   }: {
//     username: string;
//     vars?: Record<string, string>;
//   }): ThunkAction<void, RootState, any, any> =>
//   async (dispatch, action) => {
//     try {
//       const session = await gameClient.authenticateDevice({
//         username,
//         vars,
//       });
//       console.log('Authenticated device:', session);
//       dispatch(setSession(session));
//     } catch (error) {
//       console.error('Failed to authenticate device:', error);
//     }
//   };
