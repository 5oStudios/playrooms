'use client';
import { ReactNode } from 'react';
import {
  gameClient,
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_REFRESH_KEY,
} from '@core/game-client';
import { Session } from '@heroiclabs/nakama-js';
import { store } from '../store/store';
import { setSession } from '../store/features/sessionSlice';
import { nanoid } from 'nanoid';
import { generateUsername } from 'unique-username-generator';
import { genConfig } from 'react-nice-avatar';
import { storage } from '../utils/storage';

const generatedUsername = generateUsername('', 0, 8, '');
const generatedAvatarConfig = JSON.stringify(genConfig());

enum SessionState {
  TOKEN_EXPIRED,
  REFRESH_EXPIRED,
  VALID,
  UNAVAILABLE,
}

const auth = storage.getItem(LOCAL_STORAGE_AUTH_KEY) as string;
const refresh = storage.getItem(LOCAL_STORAGE_REFRESH_KEY) as string;
const session = (auth && refresh && Session.restore(auth, refresh)) || null;

const sessionState = ((session: Session) => {
  if (!session) return SessionState.UNAVAILABLE;
  if (session.isrefreshexpired(Date.now() / 1000))
    return SessionState.REFRESH_EXPIRED;
  if (session.isexpired(Date.now() / 1000)) return SessionState.TOKEN_EXPIRED;

  return SessionState.VALID;
})(session);

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  switch (sessionState) {
    case SessionState.TOKEN_EXPIRED:
      console.log('Auth Token expired');
      gameClient.sessionRefresh(session).then((session) => {
        store.dispatch(setSession(session));
      });
      break;
    case SessionState.VALID:
      console.log('Session is valid');
      store.dispatch(setSession(session));
      break;
    case SessionState.REFRESH_EXPIRED:
    case SessionState.UNAVAILABLE:
      console.log('Session unavailable or refresh expired');
      console.log('Authenticating device...');
      (async () => {
        const session = await gameClient.authenticateDevice(
          nanoid(16),
          true,
          generatedUsername
        );
        await gameClient.updateAccount(session, {
          avatar_url: generatedAvatarConfig,
        });
        store.dispatch(setSession(session));
      })();
      break;
  }

  return <>{children}</>;
}
