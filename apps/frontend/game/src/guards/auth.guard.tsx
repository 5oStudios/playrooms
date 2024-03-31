'use client';

import { ReactNode, useEffect } from 'react';

import { Session } from '@heroiclabs/nakama-js';
import { nanoid } from 'nanoid';
import { genConfig } from 'react-nice-avatar';
import { generateUsername } from 'unique-username-generator';

import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
  gameClient,
} from '@kingo/game-client';

import { useAppDispatch, useAppSelector } from '../hooks/use-redux-typed';
import { setSession } from '../lib/features/sessionSlice';
import { storage } from '../utils/storage';

const generatedUsername = generateUsername('', 0, 8, '');
const generatedAvatarConfig = JSON.stringify(genConfig());

enum SessionState {
  TOKEN_EXPIRED,
  REFRESH_EXPIRED,
  UNAVAILABLE,

  VALID,
}

const getLocalSession = () => {
  const auth = storage.getItem(LOCAL_STORAGE_AUTH_KEY) as string;
  const refresh = storage.getItem(LOCAL_STORAGE_REFRESH_KEY) as string;

  if (!auth || !refresh) {
    console.log('no auth or refresh token');
    return {
      session: null,
      state: SessionState.UNAVAILABLE,
    };
  }

  const localSession = Session.restore(auth, refresh);

  if (localSession.isrefreshexpired(Date.now() / 1000))
    return {
      session: localSession,
      state: SessionState.REFRESH_EXPIRED,
    };

  if (localSession.isexpired(Date.now() / 1000))
    return {
      session: localSession,
      state: SessionState.TOKEN_EXPIRED,
    };

  return {
    session: localSession,
    state: SessionState.VALID,
  };
};

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const session = useAppSelector((state) => state.session);
  const { session: localSession, state } = getLocalSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) return;

    switch (state) {
      case SessionState.TOKEN_EXPIRED:
        console.log('Auth Token expired');
        gameClient
          .sessionRefresh(localSession)
          .then((session) => {
            dispatch(setSession(session));
          })
          .catch((error) => {
            console.error('Error refreshing session: ', error.message);
          });
        break;

      case SessionState.VALID:
        dispatch(setSession(localSession));
        break;

      case SessionState.REFRESH_EXPIRED:
      case SessionState.UNAVAILABLE:
        console.log('Session unavailable or refresh expired');
        console.log('Authenticating device...');
        gameClient
          .authenticateDevice(nanoid(16), true, generatedUsername)
          .then((session) => {
            gameClient
              .updateAccount(session, {
                avatar_url: generatedAvatarConfig,
              })
              .then(() => {
                dispatch(setSession(session));
              });
          })
          .catch((error) => {
            console.error('Failed to authenticate device:', error);
            storage.remove(LOCAL_STORAGE_AUTH_KEY);
            storage.remove(LOCAL_STORAGE_REFRESH_KEY);
          });
        break;
    }
  }, [dispatch, localSession, session, state]);

  if (session) return <>{children}</>;
  else return <>Authenticating...</>;
}
