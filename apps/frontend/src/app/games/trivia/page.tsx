'use client';
import React from 'react';
import BaseModal from '../../../components/modals/base.modal';
import { Link, ModalContent } from '@nextui-org/react';
import { LuGamepad2 } from 'react-icons/lu';
import { IoPeople } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [isOpen, setIsOpen] = React.useState(true);
  const router = useRouter();
  return (
    <BaseModal
      className={'flex flex-row gap-3 w-full h-44'}
      closeButton={<></>}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className={'p-4'}>
        <Link
          className={
            'w-full h-full flex flex-row justify-center items-center gap-2 py-4 rounded-lg border-1 border-neutral-700 bg-default-100 cursor-pointer'
          }
          onClick={() => router.push('/games/trivia/create')}
          size={'lg'}
        >
          <IoPeople />
          <span>Create</span>
        </Link>
        <Link
          className={
            'w-full h-full flex flex-row justify-center items-center gap-2 py-4 rounded-lg border-1 border-neutral-700 bg-default-100 cursor-pointer'
          }
          onClick={() => router.push('/games/trivia/join')}
          size={'lg'}
        >
          <LuGamepad2 />
          Join
        </Link>
      </ModalContent>
    </BaseModal>
  );
}
