'use client';
import React, { useState } from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../hooks/use-redux-typed';
import { SocketState } from '../../../../../store/features/socketSlice';
import { useRouter } from 'next/navigation';
import { PlayerInfo } from '../../../../../components/players/player-info';
import BaseModal from '../../../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import LobbyActions, {
  LobbyMode,
} from '../../../../../components/lobby/lobby-actions/lobby-actions';

export default function Page({ params }: { params: { partyId: string } }) {
  const [isPartyModalOpen, setIsPartyModalOpen] = React.useState(true);
  const socketState = useAppSelector((state) => state.socket);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();

  if (socketState === SocketState.DISCONNECTED) {
    toast.error('You are not connected to the server');
    return null;
  }

  const partyId = params.partyId;

  if (partyId && socketState === SocketState.CONNECTED) {
    gameSocket.joinParty(partyId).catch((party) => {
      toast.error('Failed to join party');
      console.error(party);
      router.push('/game/trivia');
    });
  }

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          <LobbyActions mode={LobbyMode.PARTY} />
        </ModalContent>
      </BaseModal>
    </>
  );
}
