'use client';
import { gameSocket } from '@core/game-client';
import { useEffect } from 'react';
import { useAppSelector } from '../hooks/use-redux-typed';

export const Socket = () => {
  const session = useAppSelector((state) => state.session);

  useEffect(() => {
    if (session) {
      (async () => {
        await gameSocket.connect(session, true);
        console.log('Connected to socket');
      })();
    }
  });
  return null;
};
