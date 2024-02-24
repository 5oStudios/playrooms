'use client';
import { useParty } from '../../../hooks/use-party';
import BaseModal from '../../../components/modals/base.modal';
import { ModalContent } from '@nextui-org/react';
import { PlayerInfo } from '../../../components/modals/lobby';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { partyId: string } }) {
  const [isOpen, setIsOpen] = useState(true);
  const partyId = params.partyId;
  const { joinParty, party } = useParty();
  console.log(party.leader);
  useEffect(() => {
    joinParty(partyId);
  }, [partyId]);

  return (
    <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalContent className={'gap-3'}>
        <PlayerInfo />
      </ModalContent>
    </BaseModal>
  );
}
