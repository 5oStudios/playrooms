'use client';
import BaseModal from '../../../../components/modals/base.modal';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  ModalContent,
} from '@nextui-org/react';
import { PlayerInfo } from '../../../../components/players/player-info';
import React, { useState } from 'react';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

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
          <Button size={'lg'} className={'w-full'}>
            Join Online
          </Button>
          <div className={'flex flex-row w-full gap-3'}>
            <Button disabled className={'flex-1 disabled:opacity-50'}>
              Offline
            </Button>
            <Button
              href={window.location.pathname + '/party'}
              className={'w-2/3'}
            >
              Join Party
            </Button>
          </div>
          <Divider />
          <div className={'flex flex-row-reverse w-full gap-3'}>
            <Button className={'w-full disabled:opacity-50'} disabled>
              Join Match
            </Button>
            <Button disabled className={'disabled:opacity-50 w-full'}>
              Join Tournament
            </Button>
          </div>
        </>
      </ModalContent>
    </BaseModal>
  );
}
