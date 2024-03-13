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
import matchSlice from './features/matchSlice';
import { storage } from '../utils/storage';
import playerSlice from './features/playerSlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    party: partySlice,

    player: playerSlice,
    session: sessionSlice,
    user: userSlice,
    socket: socketSlice,
    match: matchSlice,
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
    storage.setItem({
      key: LOCAL_STORAGE_AUTH_KEY,
      value: session.token,
    });
    storage.setItem({
      key: LOCAL_STORAGE_REFRESH_KEY,
      value: session.refresh_token,
    });
    gameClient.getAccount(session).then((user) => {
      store.dispatch(setUser(user.user));
    });
  }
});

// auto set match host
// store.subscribe(() => {
//   if (!store.getState().match.currentMatch) store.dispatch(setMatchHost(null));
//
//   if (!store.getState().match.matchFoundData) return;
//   if (store.getState().match.isHostForCurrentMatch !== null) return;
//
//   const hostId =
//     store.getState().match.matchFoundData.users[0].presence.user_id;
//   const selfId = store.getState().match.matchFoundData.self.presence.user_id;
//   store.dispatch(setMatchHost(hostId === selfId));
// });

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
