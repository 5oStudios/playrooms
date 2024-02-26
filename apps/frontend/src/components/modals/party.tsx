import React from 'react';
import { Users } from '@heroiclabs/nakama-js';
import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import { gameClient, gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import BaseModal from './base.modal';
import { Button, Divider, ModalContent } from '@nextui-org/react';
import { genConfig } from 'react-nice-avatar';
import { GameModeButtons, NoSSRAvatar, PlayerInfo } from './create-lobby';
import { setParty } from '../../store/features/partySlice';

export default function Party() {
  const party = useAppSelector((state) => state.party.data);
  const membersAccount = useAppSelector((state) => state.party.membersAccount);
  console.log('party', party);
  const [partyLeader, setPartyLeader] = React.useState<Users['users'][0]>();
  const session = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  if (!session) return null;

  gameSocket.onparty = async (party) => {
    dispatch(setParty(party));
    const { users } = await gameClient.getUsers(
      session,
      party.presences.map((presence) => presence.user_id)
    );
    const leader = users.find((user) => user.id === party.leader.user_id);
    setPartyLeader(leader);
  };

  gameSocket.onpartypresence = async (presence) => {
    if (presence.joins) {
      const { users } = await gameClient.getUsers(
        session,
        presence.joins.map((join) => join.user_id)
      );
      users.forEach((user) => {
        toast.success(`${user.username} joined the party`);
      });
    }

    if (presence.leaves) {
      const leftUsers = await gameClient.getUsers(
        session,
        presence.leaves.map((leave) => leave.user_id)
      );
      leftUsers.users.forEach((user) => {
        toast.error(`${user.username} left the party`);
      });
    }
  };

  const isPartyLeader = partyLeader?.id === session.user_id;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <BaseModal isOpen={true} onClose={() => {}}>
        <ModalContent className={'gap-3'}>
          <PlayerInfo />
          {isPartyLeader ? (
            <GameModeButtons />
          ) : (
            <Button className={'w-full'}>Leave Party</Button>
          )}
        </ModalContent>
      </BaseModal>
    </>
  );
}

const PartyMembers = async () => {
  const party = useAppSelector((state) => state.party.data);
  const session = useAppSelector((state) => state.session);
  const { users: partyMembersAccount } = await gameClient.getUsers(
    session,
    party.presences.map((presence) => presence.user_id)
  );
  return (
    party &&
    party.presences.length > 0 && (
      <div className={'w-full'}>
        <Divider className={'my-4'} />
        <div className={'flex flex-row gap-3 justify-start'}>
          {partyMembersAccount.map((member) => (
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
