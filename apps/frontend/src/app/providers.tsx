'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AuthGuard } from '../guards/auth.guard';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux-typed';
import { setSocket, SocketState } from '../store/features/socketSlice';
import { gameSocket } from '@core/game-client';

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
  const isSocketConnected = useAppSelector(
    (state) => state.socket === SocketState.CONNECTED
  );
  const dispatch = useAppDispatch();

  if (!session) {
    dispatch(setSocket(SocketState.DISCONNECTED));
    return null;
  }
  console.log('Socket state', isSocketConnected);

  !isSocketConnected &&
    gameSocket
      .connect(session, true)
      .then(() => {
        dispatch(setSocket(SocketState.CONNECTED));
        console.log('Connected to socket');
      })
      .catch((error) => {
        console.error('Error connecting to socket: ', error.message);
        dispatch(setSocket(SocketState.DISCONNECTED));
      });

  return isSocketConnected ? <> {children} </> : null;
};
