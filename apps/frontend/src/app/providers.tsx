'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthGuard } from '../guards/auth.guard';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux-typed';
import { gameSocket } from '@core/game-client';
import { setSocket, SocketState } from '../store/features/socketSlice';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <AuthGuard>
        <Socket>
          <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
        </Socket>
      </AuthGuard>
    </Provider>
  );
}

const Socket = ({ children }: Readonly<{ children: ReactNode }>) => {
  const session = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  gameSocket.connect(session, true).then(() => {
    dispatch(setSocket(SocketState.CONNECTED));
    console.log('Connected to socket');
  });
  return <>{children}</>;
};
