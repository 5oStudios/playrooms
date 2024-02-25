'use client';
import BaseModal from '../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../components/modals/lobby';
import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';
import { useAppSelector } from '../../../hooks/use-redux-typed';
import { SocketState } from '../../../store/features/socketSlice';

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

  return (
    <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
      </ModalContent>
    </BaseModal>
  );
}
