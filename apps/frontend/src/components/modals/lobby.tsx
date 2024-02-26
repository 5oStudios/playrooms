import React from 'react';
import { Users } from '@heroiclabs/nakama-js';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { gameClient, gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import BaseModal from './base.modal';
import { Divider, ModalContent } from '@nextui-org/react';
import { genConfig } from 'react-nice-avatar';
import { GameModeButtons, NoSSRAvatar, PlayerInfo } from './create-lobby';

export default function Lobby({ partyId }: { partyId: string }) {
  const [partyMembers, setPartyMembers] = React.useState<Users['users']>([]);
  const session = useAppSelector((state) => state.session);

  gameSocket.onparty = async (party) => {
    if (party.party_id === partyId) {
      const { users } = await gameClient.getUsers(
        session,
        party.presences.map((presence) => presence.user_id)
      );
      setPartyMembers(users);
    }
  };

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
