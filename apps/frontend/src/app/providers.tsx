'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}
