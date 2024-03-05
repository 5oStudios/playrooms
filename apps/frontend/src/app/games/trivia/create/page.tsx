'use client';
import BaseModal from '../../../../components/modals/base.modal';
import { BreadcrumbItem, Breadcrumbs, ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../../components/players/player-info';
import Lobby, {
  LobbyAction,
  LobbyMode,
  lobbyModeSearchParamKey,
} from '../../../../components/lobby/lobby-actions/lobby';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateLobby } from '../../../../components/lobby/create/create-lobby';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  const searchParams = useSearchParams();
  const lobbyMode = searchParams.get(
    lobbyModeSearchParamKey
  ) as unknown as LobbyMode;

  console.log('lobbyMode', lobbyMode);
  switch (lobbyMode) {
    case LobbyMode.PARTY:
      return (
        <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent className={'gap-3'}>asdas</ModalContent>
        </BaseModal>
      );
    case LobbyMode.SOLO:
      return (
        <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent className={'gap-3'}>
            <PlayerInfo />
            <Lobby action={LobbyAction.JOIN} mode={LobbyMode.SOLO} />
          </ModalContent>
        </BaseModal>
      );
  }

  return (
    <BaseModal
      closeButton={
        <>
          <div className={'flex self-start'}>
            <Breadcrumbs variant={'solid'}>
              <BreadcrumbItem href={'/games'}>Games</BreadcrumbItem>
              <BreadcrumbItem href={'/games/trivia'}>Trivia</BreadcrumbItem>
              <BreadcrumbItem href={'/games/trivia/create'}>
                Create
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </>
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
        <CreateLobby />
      </ModalContent>
    </BaseModal>
  );
}
