'use client';
import { ReactNode } from 'react';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
} from '@core/game-client';
import { Session } from '@heroiclabs/nakama-js';
import { store } from '../store/store';
import { setSession } from '../store/features/sessionSlice';

const auth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
const refresh = localStorage.getItem(LOCAL_STORAGE_REFRESH_KEY);

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  if (auth && refresh) {
    store.dispatch(setSession(Session.restore(auth, refresh)));
  }

  return <>{children}</>;
}
