'use client';
import { ReactNode, useEffect } from 'react';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
} from '@core/game-client';
import { Session } from '@heroiclabs/nakama-js';
import { store } from '../store/store';
import { setSession } from '../store/features/sessionSlice';
import { useAppSelector } from '../hooks/use-redux-typed';

const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
const refresh = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const user = useAppSelector((state) => state.user);
  // if (auth && refresh) {
  //   store.dispatch(setSession(Session.restore(auth, refresh)));
  // }
  // else {
  //   const session = await gameClient.authenticateDevice(nanoid(16), true, user.username);
  //   store.dispatch(setSession(session));
  // }
  useEffect(() => {
    if (!auth || !refresh) {
      console.log('Authenticating device...');
      // (async () => {
      //   const session = await gameClient.authenticateDevice(
      //     nanoid(16),
      //     true,
      //     generatedUsername
      //   );
      //   store.dispatch(setSession(session));
      // })();
    } else {
      console.log('Restoring session...');
      store.dispatch(setSession(Session.restore(auth, refresh)));
    }
  }, [user]);

  return <>{children}</>;
}
