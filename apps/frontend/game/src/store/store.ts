import { configureStore } from '@reduxjs/toolkit';
import sessionSlice from './features/sessionSlice';
import userSlice, { setUser } from './features/userSlice';
import {
  gameClient,
  gameSocket,
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
} from '@kingo/game-client';
import platformSlice from './features/platformSlice';
import partySlice from './features/partySlice';
import matchSlice, { MatchState } from './features/matchSlice';
import { storage } from '../utils/storage';
import playersSlice from './features/playersSlice';
import socketSlice, { setSocket, SocketState } from './features/socketSlice';
import externalChatSlice from './features/externalChatSlice';
import tournamentSlice from './features/tournamentSlice';

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    party: partySlice,

    players: playersSlice,
    tournament: tournamentSlice,
    externalChat: externalChatSlice,
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
export const isMatchStarted =
  store.getState().match.currentMatchState === MatchState.STARTED;

store.subscribe(() => {
  const session = store.getState().session;
  const socket = store.getState().socket;
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

    if (!session) return;
    if (socket === SocketState.CONNECTED) return;
    gameSocket
      .connect(session, true)
      .then((socket) => {
        store.dispatch(setSocket(SocketState.CONNECTED));
        console.log('Connected to socket');
      })
      .catch((error) => {
        console.error('Error connecting to socket: ', error.message);
        store.dispatch(setSocket(SocketState.DISCONNECTED));
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
