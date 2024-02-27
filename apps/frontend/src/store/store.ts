import { configureStore } from '@reduxjs/toolkit';
import sessionSlice from './features/sessionSlice';
import userSlice, { setUser } from './features/userSlice';
import {
  gameClient,
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
} from '@core/game-client';
import platformSlice from './features/platformSlice';
import socketSlice from './features/socketSlice';
import partySlice from './features/partySlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    // player: playerSlice,
    party: partySlice,

    session: sessionSlice,
    user: userSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
  const session = store.getState().session;
  const user = store.getState().user;
  if ((!user && session) || (user && user.id !== session.user_id)) {
    typeof window !== 'undefined' &&
      window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, session.token);
    typeof window !== 'undefined' &&
      window.localStorage.setItem(
        LOCAL_STORAGE_REFRESH_KEY,
        session.refresh_token
      );
    gameClient.getAccount(session).then((user) => {
      store.dispatch(setUser(user.user));
    });
  }
});

// store.subscribe(() => {
//   if (!store.getState().party.data) return;
//
//   const partyMembers = store.getState().party.data.presences;
//   const partyMembersAccount = store.getState().party.membersAccount?.users;
//
//   if (partyMembers.length === 0) return;
//   if (partyMembersAccount && partyMembersAccount.length === partyMembers.length)
//     return;
//
//   gameClient
//     .getUsers(
//       store.getState().session,
//       partyMembers.map((presence) => presence.user_id)
//     )
//     .then((res) => {
//       store.dispatch(setPartyMembersAccount(res));
//     })
//
//     .catch((err) => {
//       console.error(err);
//       return [];
//     });
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
