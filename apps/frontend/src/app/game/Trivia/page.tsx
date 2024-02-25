'use client';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../hooks/use-redux-typed';
import { PlayerInfo } from '../../../components/modals/lobby';
import { gameSocket } from '@core/game-client';

export default function Index() {
  const session = useAppSelector((state) => state.session);
  const account = useAppSelector((state) => state.user);
  useEffect(() => {
    (async () => {
      await gameSocket.connect(session, true);
      await gameSocket.joinParty('test');
    })();
  }, []);

  return (
    <div className="flex justify-center items-center">
      {/*<Lobby />*/}
      <PlayerInfo />

      {/*<Nakama />*/}
    </div>
  );
}
