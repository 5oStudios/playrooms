'use client';

import { ReactNode } from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';

import { store } from '@store';

import { AuthGuard } from '../guards/auth.guard';

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
