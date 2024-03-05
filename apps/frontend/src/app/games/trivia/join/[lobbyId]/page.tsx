'use client';
import React, { useState } from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import { useAppSelector } from '../../../../../hooks/use-redux-typed';
import { SocketState } from '../../../../../store/features/socketSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlayerInfo } from '../../../../../components/players/player-info';
import BaseModal from '../../../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import JoinLobby, {
  lobbyModeSearchParamKey,
} from '../../../../../components/lobby/lobby-actions/joinLobby';

export default function Page({ params }: { params: { lobbyId: string } }) {
  const socketState = useAppSelector((state) => state.socket);
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();
  const lobbyMode = useSearchParams().get(lobbyModeSearchParamKey);

  if (socketState === SocketState.DISCONNECTED) {
    toast.error('You are not connected to the server');
    return null;
  }

  const lobbyId = params.lobbyId;

  if (lobbyId && socketState === SocketState.CONNECTED) {
    gameSocket.joinParty(lobbyId).catch((party) => {
      toast.error('Failed to join party');
      console.error(party);
      router.push('/games/trivia');
    });
  }

  console.log('sending', +lobbyMode);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          <JoinLobby mode={+lobbyMode} />
        </ModalContent>
      </BaseModal>
    </>
  );
}
