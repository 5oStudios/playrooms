'use client';

import { ReactNode, useRef } from 'react';
import React from 'react';

import { Provider } from 'react-redux';

import { AppStore, makeStore } from '../lib/store';
import { SuperTokensProvider } from './providers/SupertokensProvider';

export const Providers = ({ children }: { children: ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <SuperTokensProvider>
      <Provider store={storeRef.current}>{children}</Provider>
    </SuperTokensProvider>
  );
}
