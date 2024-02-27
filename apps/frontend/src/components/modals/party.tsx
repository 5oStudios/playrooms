import React, { useState } from 'react';
import { Users } from '@heroiclabs/nakama-js';
import { useAppSelector } from '../../hooks/use-redux-typed';
import BaseModal from './base.modal';
import { Button, Divider, ModalContent } from '@nextui-org/react';
import { genConfig } from 'react-nice-avatar';
import QRCode from 'react-qr-code';
import { NoSSRAvatar, PlayerInfo } from '../players/player-info';
import { gameClient, gameSocket } from '@core/game-client';
import { toast } from 'sonner';

export default function Party() {
  const party = useAppSelector((state) => state.party.data);
  const [partyLeader, setPartyLeader] = React.useState<Users['users'][0]>();
  const session = useAppSelector((state) => state.session);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  if (!session) return null;

  console.log('partyLeader', partyLeader);
  const isPartyLeader = party?.leader?.user_id === session.user_id;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <BaseModal isOpen={true} onClose={() => {}}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          {isPartyLeader || !party ? (
            <div className={'flex flex-col w-full gap-3'}>
              <Button className={'w-full'}>Start Game</Button>
              <div className={'flex gap-3'}>
                <Button className={'w-1/3'} onClick={() => {}}>
                  Leave Party
                </Button>
                <Button
                  className={'w-2/3'}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Invite
                </Button>
              </div>
            </div>
          ) : (
            <div className={'flex flex-col w-full gap-3'}>
              <Button disabled className={'w-full '}>
                Waiting for Host to start
              </Button>
              <div className={'flex gap-3'}>
                <Button className={'w-1/3'} onClick={() => {}}>
                  Leave Party
                </Button>
                <Button
                  className={'w-2/3'}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Invite
                </Button>
              </div>
            </div>
          )}
          <PartyMembers />
        </ModalContent>
      </BaseModal>

      <InviteToParty
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </>
  );
}

const PartyMembers = () => {
  const session = useAppSelector((state) => state.session);
  const [localPartyMembers, setLocalPartyMembers] = useState<Users['users']>(
    []
  );

  console.log('localPartyMembers', localPartyMembers);
  // first time join party
  gameSocket.onparty = async (party) => {
    console.log('party', party);
    gameClient
      .getUsers(
        session,
        party.presences.map((presence) => presence.user_id)
      )
      .then(({ users }) => {
        setLocalPartyMembers((prevMembers) => [...prevMembers, ...users]);
      });
  };

  gameSocket.onpartypresence = async (presence) => {
    if (presence.joins) {
      presence.joins.forEach((user) => {
        if (user.user_id === session.user_id) return;
        toast.success(`${user.username} joined the party`);
        gameClient.getUsers(session, [user.user_id]).then(({ users }) => {
          setLocalPartyMembers((prevMembers) => [...prevMembers, ...users]);
        });
      });
    }

    if (presence.leaves) {
      presence.leaves.forEach((user) => {
        toast.error(`${user.username} left the party`);
      });
      const newPartyMembersAccount = localPartyMembers.filter(
        (member) => !presence.leaves.find((user) => user.user_id === member.id)
      );
      setLocalPartyMembers(newPartyMembersAccount);
    }
  };

  return (
    localPartyMembers.length >= 1 && (
      <div className={'w-full'}>
        <Divider className={'my-4'} />
        <div className={'flex flex-row gap-3 justify-start'}>
          {localPartyMembers
            .filter((member) => member.id !== session.user_id)
            .map((member) => (
              <NoSSRAvatar
                key={member.id}
                className={'w-12 h-12'}
                {...genConfig(member.avatar_url)}
              />
            ))}
        </div>
      </div>
    )
  );
};

const InviteToParty = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const party = useAppSelector((state) => state.party.data);
  const inviteLink =
    new URL(window.location.href).origin + `/join/${party?.party_id ?? ''}`;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size={'xs'}>
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
            onClose();
          }}
          className={'w-full'}
        >
          Copy Link
        </Button>
      </ModalContent>
    </BaseModal>
  );
};
