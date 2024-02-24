'use client';
import React from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import dynamic from 'next/dynamic';
import {
  useTypedDispatch,
  useTypedSelector,
} from '../../hooks/use-redux-typed';
import { setUsername } from '../../store/features/playersSlice';

const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});

export default function Lobby() {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: true,
  });
  const player = useTypedSelector((state) => state.player);
  const dispatch = useTypedDispatch();
  return (
    <>
      <Modal
        backdrop={'blur'}
        placement={'center'}
        isOpen={isOpen}
        onClose={onClose}
        className={'flex justify-center items-center p-4 m-4'}
      >
        <ModalContent className={'gap-3'}>
          <NoSSRAvatar className={'h-44 w-44'} {...player.avatarConfig} />
          <Input
            className={'w-full'}
            value={player.username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
          />
          <Button size={'lg'} className={'w-full'}>
            Join Online
          </Button>
          <div className={'flex flex-row w-full gap-3'}>
            <Button className={'w-2/3'}>Private</Button>
            <Button className={'flex-1'}>Invite</Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
