'use client';

import React, { ReactNode } from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';

import { AuthGuard } from '../guards/auth.guard';
import { store } from '../lib/store';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <AuthGuard>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </AuthGuard>
    </Provider>
  );
}
