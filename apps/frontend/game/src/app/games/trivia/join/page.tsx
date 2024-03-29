'use client';

import { Suspense, useState } from 'react';

import { BreadcrumbItem, Breadcrumbs, ModalContent } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

import {
  BaseModal,
  JoinLobby,
  LobbyMode,
  PlayerInfo,
  lobbyModeSearchParamKey,
  partyIdSearchParamKey,
} from '@components';
import { useAppSelector } from '@hooks';
import { SocketState } from '@store';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BaseModal
      closeButton={
        <div className={'flex self-start'}>
          <Breadcrumbs variant={'solid'}>
            <BreadcrumbItem href={'/games'}>Games</BreadcrumbItem>
            <BreadcrumbItem href={'/games/trivia'}>Trivia</BreadcrumbItem>
            <BreadcrumbItem href={'/games/trivia/join'}>Join</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      }
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
        <Suspense fallback={<div>Loading...</div>}>
          <SuspendedJoinLobby />
        </Suspense>
      </ModalContent>
    </BaseModal>
  );
}

const SuspendedJoinLobby = () => {
  const searchParams = useSearchParams();
  const lobbyMode = searchParams.get(lobbyModeSearchParamKey) || LobbyMode.SOLO;
  const partyId = searchParams.get(partyIdSearchParamKey);
  const socket = useAppSelector((state) => state.socket);
  if (socket !== SocketState.CONNECTED) return null;

  return <JoinLobby partyId={partyId} mode={+lobbyMode} />;
};
