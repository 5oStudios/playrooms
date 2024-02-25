'use client';
import BaseModal from '../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../components/modals/lobby';
import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { toast } from 'sonner';

export default function Page({ params }: { params: { partyId: string } }) {
  const [isOpen, setIsOpen] = useState(true);
  const partyId = params.partyId;
  useEffect(() => {
    (async () => {
      if (partyId) {
        try {
          await gameSocket.joinParty(partyId);
        } catch (e) {
          toast.error('Failed to join party');
          console.error(e);
        }
      }
    })();
  }, [partyId]);

  return (
    <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
      </ModalContent>
    </BaseModal>
  );
}
