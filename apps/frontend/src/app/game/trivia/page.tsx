'use client';
import React from 'react';
import BaseModal from '../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../components/players/player-info';
import LobbyActions, {
  LobbyMode,
} from '../../../components/lobby/lobby-actions/lobby-actions';

export default function Index() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // <MovingBorder>
    <BaseModal isOpen={true} onClose={() => {}}>
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
        <LobbyActions mode={LobbyMode.SOLO} />
      </ModalContent>
    </BaseModal>
    // </MovingBorder>
  );
}
