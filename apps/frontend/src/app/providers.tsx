'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthGuard } from '../guards/auth.guard';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <NextUIProvider>{children}</NextUIProvider>
      </AuthGuard>
    </Provider>
  );
}
