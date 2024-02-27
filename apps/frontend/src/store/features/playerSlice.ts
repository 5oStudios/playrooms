'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@heroiclabs/nakama-js';
// interface PlayerState {
//   session: PlayerSession | null;
//   error: string | null;
// }
//
// const initialState: AuthState = {
//   session: (async () => {
//     const session = gameClient.getSessionFromLocalStorage();
//     if (session) return session;
//     else
//       try {
//         return await gameClient.authenticateDevice({
//           username: store.getState().player.username,
//           vars: {
//             avatarConfig: JSON.stringify(store.getState().player.avatarConfig),
//           },
//         });
//       } catch (error) {
//         console.error('Failed to restore session:', error);
//         return null;
//       }
//   })(),
//   error: null,
// };

// const initSession: PlayerSession = JSON.parse(
//   localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
// ) || {
//   username: generatedUsername,
//   vars: {
//     avatarConfig: generatedAvatarConfig,
//     avatarUrl: null,
//   },
// };
// const initialState: PlayerState = {
//   session: initSession,
//   error: null,
// };

const playerSlice = createSlice({
  name: 'player',
  initialState: null,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      state.session = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.session.username = action.payload;
    },
    setAvatarConfig(state, action: PayloadAction<string>) {
      state.session.vars.avatarConfig = action.payload;
    },
  },
});
export default playerSlice.reducer;

export const { setSession, setError, setUsername, setAvatarConfig } =
  playerSlice.actions;

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
