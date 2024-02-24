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
import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import {
  authenticateDevice,
  setUsername,
} from '../../store/features/playerSlice';
import { genConfig } from 'react-nice-avatar';
import { LOCAL_STORAGE_SESSION_KEY } from '@core/game-client';

const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});

export default function Lobby() {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: true,
  });
  const username = useAppSelector((state) => state.player.session.username);
  const avatarConfig = useAppSelector(
    (state) => state.player.session.vars.avatarConfig
  );
  const dispatch = useAppDispatch();

  const parsedAvatarConfig = JSON.parse(avatarConfig);
  console.log('avatarConfig', parsedAvatarConfig);
  console.log('avatarConfig', localStorage.getItem(LOCAL_STORAGE_SESSION_KEY));
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
          <NoSSRAvatar
            className={'w-44 h-44'}
            {...genConfig(parsedAvatarConfig)}
          />
          <Input
            className={'w-full'}
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
          />
          <Button
            onClick={() => {
              dispatch(
                authenticateDevice({
                  username,
                  vars: {
                    avatarConfig,
                  },
                })
              );
            }}
            size={'lg'}
            className={'w-full'}
          >
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
