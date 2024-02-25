'use client';
import React from 'react';
import { useAppSelector } from '../../../hooks/use-redux-typed';
import Lobby from '../../../components/modals/lobby';

export default function Index() {
  const session = useAppSelector((state) => state.session);
  const account = useAppSelector((state) => state.user);
  // useEffect(() => {
  //   if (!session) return;
  //   (async () => {
  //     await gameSocket.connect(session, true);
  //     await gameSocket.joinParty('test');
  //   })();
  // }, [session]);

  return (
    <div className="flex justify-center items-center">
      <Lobby />
      {/*<PlayerInfo />*/}

      {/*<Nakama />*/}
    </div>
  );
}
