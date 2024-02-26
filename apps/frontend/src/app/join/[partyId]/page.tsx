'use client';
import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import { useAppSelector } from '../../../hooks/use-redux-typed';
import { SocketState } from '../../../store/features/socketSlice';
import Lobby from '../../../components/modals/lobby';

export default function Page({ params }: { params: { partyId: string } }) {
  const [isOpen, setIsOpen] = useState(true);
  const socketState = useAppSelector((state) => state.socket);
  const partyId = params.partyId;
  useEffect(() => {
    (async () => {
      if (partyId && socketState === SocketState.CONNECTED) {
        try {
          await gameSocket.joinParty(partyId);
        } catch (e) {
          toast.error('Failed to join party');
          console.error(e);
        }
      }
    })();
  }, [partyId, socketState]);

  gameSocket.onpartypresence = (presence) => {
    console.log('onPartyPresence', presence);
    presence.joins &&
      presence.joins.forEach((join) => {
        toast.success(`${join.username} joined the party`);
      });
    presence.leaves &&
      presence.leaves.forEach((leave) => {
        toast.error(`${leave.username} left the party`);
      });
  };

  // return <PlayerInfo />;
  return <Lobby partyId={partyId} />;
}
