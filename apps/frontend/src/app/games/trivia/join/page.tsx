'use client';
import BaseModal from '../../../../components/modals/base.modal';
import { BreadcrumbItem, Breadcrumbs, ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../../components/players/player-info';
import React, { useState } from 'react';
import Lobby, {
  LobbyAction,
  LobbyMode,
} from '../../../../components/lobby/lobby-actions/lobby';
import useLobby from '../../../../hooks/use-lobby';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const { setLobbyState, setQueueTicket } = useLobby({
    lobbyMode: LobbyMode.SOLO,
  });

  return (
    <BaseModal
      closeButton={
        <>
          <div className={'flex self-start'}>
            <Breadcrumbs variant={'solid'}>
              <BreadcrumbItem href={'/games'}>Games</BreadcrumbItem>
              <BreadcrumbItem href={'/games/trivia'}>Trivia</BreadcrumbItem>
              <BreadcrumbItem href={'/games/trivia/join'}>Join</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </>
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
        <>
          <Lobby action={LobbyAction.JOIN} />
        </>
      </ModalContent>
    </BaseModal>
  );
}
