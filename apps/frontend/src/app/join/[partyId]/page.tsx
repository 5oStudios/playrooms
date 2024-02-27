'use client';
import React from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import { useAppSelector } from '../../../hooks/use-redux-typed';
import { SocketState } from '../../../store/features/socketSlice';
import Party from '../../../components/modals/party';
import { useRouter } from 'next/navigation';
import PartyPresencesToast from '../../../components/party/party-presences-toast';

export default function Page({ params }: { params: { partyId: string } }) {
  const socketState = useAppSelector((state) => state.socket);

  const partyId = params.partyId;
  const router = useRouter();

  (async () => {
    if (partyId && socketState === SocketState.CONNECTED) {
      try {
        await gameSocket.joinParty(partyId);
      } catch (e) {
        toast.error('Failed to join party');
        router.push('/');
        console.error(e);
      }
    }
  })();

  // return <PlayerInfo />;
  return (
    <>
      <Party />
      <PartyPresencesToast />
    </>
  );
}
