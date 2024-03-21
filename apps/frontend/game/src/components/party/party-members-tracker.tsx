import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';
import React, { useState } from 'react';
import { Users } from '@heroiclabs/nakama-js';
import { gameClient, gameSocket } from '@kingo/game-client';
import { setParty } from '../../store/features/partySlice';
import { toast } from 'sonner';
import { Divider } from '@nextui-org/react';
import { NoSSRAvatar } from '../players/player-info';
import { genConfig } from 'react-nice-avatar';

export const PartyMembersTracker = () => {
  const session = useAppSelector((state) => state.session);
  const [localPartyMembers, setLocalPartyMembers] = useState<Users['users']>(
    []
  );
  const dispatch = useAppDispatch();
  console.log('localPartyMembers', localPartyMembers);
  // first time join party
  gameSocket.onparty = async (party) => {
    console.log('party', party);
    dispatch(setParty(party));
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
