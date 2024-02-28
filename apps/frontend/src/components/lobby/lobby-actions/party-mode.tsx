import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-redux-typed';
import { Button } from '@nextui-org/react';
import { gameSocket } from '@core/game-client';
import { useRouter } from 'next/navigation';
import { setParty } from '../../../store/features/partySlice';
import { setMatchFoundData } from '../../../store/features/matchSlice';
import { PartyMembersTracker } from '../../party/party-members-tracker';
import { InviteToParty } from '../../party/invite-to-party.modal';

export default function PartyMode() {
  const party = useAppSelector((state) => state.party);
  const session = useAppSelector((state) => state.session);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!session) return null;

  const isPartyLeader = party?.leader?.user_id === session.user_id;

  gameSocket.onmatchmakermatched = (matched) => {
    console.info('Received MatchmakerMatched message: ', matched);
    console.info('Matched opponents: ', matched.users);

    dispatch(setMatchFoundData(matched));
  };

  const handleLeaveParty = () => {
    console.log('leaving party', party);
    gameSocket.leaveParty(party.party_id).then(() => {
      dispatch(setParty(null));
      router.push('/');
    });
  };

  return (
    <>
      <div className={'flex flex-col w-full gap-3'}>
        {isPartyLeader || !party ? (
          <Button
            onClick={() => {
              if (!party)
                gameSocket.addMatchmaker('*', 2, 2).then((ticket) => {
                  console.log('solo online ticket', ticket);
                });
              else
                gameSocket
                  .addMatchmakerParty(party.party_id, '*', 2, 4)
                  .then((ticket) => {
                    console.log('party online ticket', ticket);
                  });
            }}
            className={'w-full'}
          >
            Start Game
          </Button>
        ) : (
          <Button disabled className={'w-full '}>
            Waiting for Host to start
          </Button>
        )}
        <div className={'flex gap-3'}>
          <Button className={'w-1/3'} onClick={handleLeaveParty}>
            Leave Party
          </Button>
          <Button className={'w-2/3'} onClick={() => setInviteModalOpen(true)}>
            Invite
          </Button>
        </div>
      </div>
      <PartyMembersTracker />

      <InviteToParty
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </>
  );
}
