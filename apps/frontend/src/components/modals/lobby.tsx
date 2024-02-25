'use client';
import React, { useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import dynamic from 'next/dynamic';
import QRCode from 'react-qr-code';
import BaseModal from './base.modal';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { setUsername } from '../../store/features/playerSlice';
import { genConfig } from 'react-nice-avatar';
import { generateUsername } from 'unique-username-generator';
import { gameSocket } from '@core/game-client';
import { Party } from '@heroiclabs/nakama-js';

const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});

const generatedUsername = generateUsername('', 0, 8, '');
const generatedAvatarConfig = JSON.stringify(genConfig());
const parsedAvatarConfig = JSON.parse(generatedAvatarConfig);

export const PlayerInfo = () => {
  const user = useAppSelector((state) => state.user);

  if (!user)
    return (
      <div>
        <p>loading...</p>
      </div>
    );

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
};

export default function Lobby() {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: true,
  });
  const [invModal, setInvModal] = React.useState(false);
  const session = useAppSelector((state) => state.session);
  const [party, setParty] = React.useState<Party>(null);

  const handleJoinOnline = async () => {
    await gameSocket.joinParty('test');
  };
  const handleInvite = async () => {
    gameSocket.createParty(true, 4).then(setParty);
    setInvModal(true);
  };
  const inviteLink =
    new URL(window.location.href).origin + `/join/${party?.party_id}`;
  useEffect(() => {
    console.log(party);
  }, [party]);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          <Button onClick={handleJoinOnline} size={'lg'} className={'w-full'}>
            Join Online
          </Button>
          <div className={'flex flex-row w-full gap-3'}>
            <Button className={'w-2/3'}>Private</Button>
            <Button onClick={handleInvite} className={'flex-1'}>
              Invite
            </Button>
          </div>
        </ModalContent>
      </BaseModal>

      {/* inv modal */}
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
}
