import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-redux-typed';
import { Button } from '@nextui-org/react';
import { gameSocket } from '@kingo/game-client';
import { useRouter } from 'next/navigation';
import { setParty } from '../../../store/features/partySlice';
import { PartyMembersTracker } from '../../party/party-members-tracker';
import { InviteToParty } from '../../party/invite-to-party.modal';
import { PartyOpCodes, PartyState } from './joinLobby';
import { MatchmakerTicket, PartyMatchmakerTicket } from '@heroiclabs/nakama-js';

export default function LobbyPartyMode({
  setPartyState,
  setQueueTicket,
}: {
  setPartyState: (partyState: PartyState) => void;
  setQueueTicket: (ticket: MatchmakerTicket | PartyMatchmakerTicket) => void;
}) {
  const party = useAppSelector((state) => state.party);
  const session = useAppSelector((state) => state.session);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!session) return null;

  const isPartyLeader = party?.leader?.user_id === session.user_id;
  const handleJoinOnline = () => {
    setPartyState(PartyState.IN_QUEUE);
    gameSocket.addMatchmakerParty(party.party_id, '*', 2, 4).then((ticket) => {
      console.log('PartyOpCodes.QUEUE_STATE', PartyOpCodes.QUEUE_STATE);
      gameSocket.sendPartyData(
        party.party_id,
        PartyOpCodes.QUEUE_STATE,
        PartyState.IN_QUEUE
      );
      setQueueTicket(ticket);
    });
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
          <Button onClick={handleJoinOnline} className={'w-full'}>
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
