'use client';

import { ReactNode, useRef } from 'react';
import React from 'react';

import { Provider } from 'react-redux';
import { signInAndUp } from 'supertokens-auth-react/recipe/thirdparty';
import {
  PermissionClaim,
  UserRoleClaim,
} from 'supertokens-auth-react/recipe/userroles';

import { setUser, verifySession } from '../lib/features/auth/userSlice';
import { AppStore, makeStore } from '../lib/store';
import { SuperTokensProvider } from './providers/SupertokensProvider';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SuperTokensProvider>
      <StoreProvider>{children}</StoreProvider>
    </SuperTokensProvider>
  );
};

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // const session = data.useUserContext();
  // if (session.loading) {
  //   return <div>Loading...</div>;
  // }
  // if (!session.doesSessionExist) {
  //   return <div>Session does not exist</div>;
  // }
  // const suer  =
  // storeRef.current.dispatch(setUser(user));

  storeRef.current.dispatch(verifySession());

  return <Provider store={storeRef.current}>{children}</Provider>;
}
