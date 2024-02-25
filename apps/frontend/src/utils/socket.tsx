'use client';
import { gameSocket } from '@core/game-client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/use-redux-typed';
import { setSocket, SocketState } from '../store/features/socketSlice';

export const Socket = () => {
  const session = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) {
      (async () => {
        await gameSocket.connect(session, true);
        dispatch(setSocket(SocketState.CONNECTED));
        console.log('Connected to socket');
      })();
    } else {
      dispatch(setSocket(SocketState.DISCONNECTED));
    }
  });
  return null;
};
