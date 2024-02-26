'use client';
import React from 'react';
import { Button, Input, Modal, ModalContent } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import QRCode from 'react-qr-code';
import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import { setUsername } from '../../store/features/playerSlice';
import { genConfig } from 'react-nice-avatar';
import { gameSocket } from '@core/game-client';
import { setParty } from '../../store/features/partySlice';

export const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});

export const PlayerInfo = () => {
  const user = useAppSelector((state) => state.user);

  if (user)
    return (
      <>
        <NoSSRAvatar className={'w-44 h-44'} {...genConfig(user.avatar_url)} />
        <Input
          className={'w-full'}
          value={user.username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </>
    );
  else return <>loading...</>;
};

export const GameModeButtons = () => {
  const [invModal, setInvModal] = React.useState(false);
  const dispatch = useAppDispatch();
  const [isInvLoading, setIsInvLoading] = React.useState(false);

  const party = useAppSelector((state) => state.party.data);
  const handleJoinOnline = async () => {
    await gameSocket.joinParty('test');
  };
  const handleInvite = async () => {
    setIsInvLoading(true);
    const party = await gameSocket.createParty(true, 4);

    dispatch(setParty(party));
    setIsInvLoading(false);
    setInvModal(true);
  };
  const inviteLink =
    new URL(window.location.href).origin + `/join/${party?.party_id ?? ''}`;
  console.log('inviteLink', inviteLink);
  console.log('party', party);

  return (
    <>
      <Button onClick={handleJoinOnline} size={'lg'} className={'w-full'}>
        Join Online
      </Button>
      <div className={'flex flex-row w-full gap-3'}>
        <Button className={'w-2/3'}>Private</Button>
        <Button
          isLoading={isInvLoading}
          onClick={handleInvite}
          className={'flex-1'}
        >
          Invite
        </Button>
      </div>

      <Modal
        backdrop={'blur'}
        placement={'center'}
        isOpen={invModal}
        onClose={() => setInvModal(false)}
        size={'xs'}
        className={'flex justify-center items-center p-4 m-4'}
      >
        <ModalContent className={'gap-3'}>
          <QRCode
            size={128}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={inviteLink}
            viewBox={`0 0 256 256`}
          />
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(inviteLink);
              setInvModal(false);
            }}
            className={'w-full'}
          >
            Copy Link
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};
