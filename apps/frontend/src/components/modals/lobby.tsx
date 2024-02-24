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
import { genConfig } from 'react-nice-avatar';
import { usePlayer } from '../../hooks/use-player';
import { useAuth } from '../../hooks/use-auth';
import { useParty } from '../../hooks/use-party';
import QRCode from 'react-qr-code';

const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});

export default function Lobby() {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: true,
  });

  const [invModal, setInvModal] = React.useState(false);
  const { username, avatarConfig, setUsername } = usePlayer();
  const { party, createParty } = useParty();
  const { isAuth, authenticateDevice } = useAuth();

  const parsedAvatarConfig = JSON.parse(avatarConfig);

  React.useEffect(() => {
    console.log('auth', isAuth, username, parsedAvatarConfig);
    if (!isAuth) {
      authenticateDevice({
        username,
        vars: {
          avatarConfig: JSON.stringify(parsedAvatarConfig),
        },
      });
    }
  }, [isAuth, parsedAvatarConfig, username]);

  const handleJoinOnline = () => createParty({ open: true, maxPlayers: 4 });
  const handleInvite = () => {
    createParty({ open: true, maxPlayers: 4 });
    setInvModal(true);
  };

  const inviteLink = window.location.href + `join/=${party.party_id}`;

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
            onChange={(e) => setUsername(e.target.value)}
          />
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
      </Modal>

      {/* inv modal */}
      <Modal
        backdrop={'blur'}
        placement={'center'}
        isOpen={invModal}
        onClose={onClose}
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
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
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
