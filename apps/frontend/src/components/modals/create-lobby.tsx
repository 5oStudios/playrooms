'use client';
import React from 'react';
import { Button, Divider, Input, Modal, ModalContent } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import QRCode from 'react-qr-code';
import BaseModal from './base.modal';
import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import { setUsername } from '../../store/features/playerSlice';
import { genConfig } from 'react-nice-avatar';
import { gameClient, gameSocket } from '@core/game-client';
import { Users } from '@heroiclabs/nakama-js';
import { toast } from 'sonner';
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

  const party = useAppSelector((state) => state.party);
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
    new URL(window.location.href).origin + `/join/${party?.party_id}`;

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

export default function CreateLobby() {
  const [partyMembers, setPartyMembers] = React.useState<Users['users']>([]);
  const session = useAppSelector((state) => state.session);

  gameSocket.onpartypresence = async (presence) => {
    if (presence.joins) {
      const { users } = await gameClient.getUsers(
        session,
        presence.joins.map((join) => join.user_id)
      );
      if (
        partyMembers.some((member) =>
          users.some((user) => user.id === member.id)
        )
      )
        return;
      setPartyMembers((prevState) => [...prevState, ...users]);
      users.forEach((user) => {
        toast.success(`${user.username} joined the party`);
      });
    }
    gameSocket.onparty = async (party) => {
      console.log('onParty', party);
    };

    if (presence.leaves) {
      const leftUsers = await gameClient.getUsers(
        session,
        presence.leaves.map((leave) => leave.user_id)
      );
      setPartyMembers((prevState) =>
        prevState.filter(
          (user) => !leftUsers.users.some((u) => u.id === user.id)
        )
      );
      leftUsers.users.forEach((user) => {
        toast.error(`${user.username} left the party`);
      });
    }
  };

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <BaseModal isOpen={true} onClose={() => {}}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          <GameModeButtons />

          {partyMembers.length > 0 && (
            <div className={'w-full'}>
              <Divider className={'my-4'} />
              <div className={'flex flex-row gap-3 justify-start'}>
                {partyMembers.map((member) => (
                  <NoSSRAvatar
                    key={member.id}
                    className={'w-12 h-12'}
                    {...genConfig(member.avatar_url)}
                  />
                ))}
              </div>
            </div>
          )}
        </ModalContent>
      </BaseModal>
    </>
  );
}
