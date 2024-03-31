'use client';

import React, { ReactNode } from 'react';
import { useRef } from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';

import { AuthGuard } from '../guards/auth.guard';
import { AppStore, makeStore } from '../lib/store';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  return (
    <StoreProvider>
      <AuthGuard>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </AuthGuard>
    </StoreProvider>
  );
}

function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
