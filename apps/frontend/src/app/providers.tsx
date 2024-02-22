'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
