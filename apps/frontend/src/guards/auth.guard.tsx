'use client';
import { ReactNode } from 'react';
import { LOCAL_STORAGE_SESSION_KEY } from '@core/game-client';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux-typed';
import { setSession } from '../store/features/playerSlice';

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  if (auth.session) return <>{children}</>;

  const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  if (session) dispatch(setSession(JSON.parse(session)));

  // TODO: goto login page
  return <>{children}</>;
}
