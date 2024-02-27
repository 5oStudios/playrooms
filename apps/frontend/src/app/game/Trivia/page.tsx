'use client';
import React from 'react';
import BaseModal from '../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import { GameModeButtons } from '../../../components/modals/create-party';
import { PlayerInfo } from '../../../components/players/player-info';

export default function Index() {
  // const session = useAppSelector((state) => state.session);
  // const account = useAppSelector((state) => state.user);
  // // useEffect(() => {
  // //   if (!session) return;
  // //   (async () => {
  // //     await gameSocket.connect(session, true);
  // //     await gameSocket.joinParty('test');
  // //   })();
  // // }, [session]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <BaseModal isOpen={true} onClose={() => {}}>
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
        <GameModeButtons />
      </ModalContent>
    </BaseModal>
  );
}
