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

export const store = configureStore({
  reducer: {
    platform: platformSlice,
    // player: playerSlice,
    // party: partySlice,

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
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, session.token);
    localStorage.setItem(LOCAL_STORAGE_REFRESH_KEY, session.refresh_token);
    gameClient.getAccount(session).then((user) => {
      store.dispatch(setUser(user.user));
    });
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
