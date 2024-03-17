'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthGuard } from '../guards/auth.guard';
import { useRouter } from 'next/navigation';

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
