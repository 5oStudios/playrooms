'use client';

import { useState } from 'react';

import { BreadcrumbItem, Breadcrumbs, ModalContent } from '@nextui-org/react';

import { BaseModal, CreateLobby, PlayerInfo } from '@components';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BaseModal
      closeButton={
        <div className={'flex self-start'}>
          <Breadcrumbs variant={'solid'}>
            <BreadcrumbItem href={'/games'}>Games</BreadcrumbItem>
            <BreadcrumbItem href={'/games/trivia'}>Trivia</BreadcrumbItem>
            <BreadcrumbItem href={'/games/trivia/create'}>
              Create
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
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
