'use client';
import { useState } from 'react';
import CreateTournamentModal from '../../../../../components/lobby/create/modes/create-tournament';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <CreateTournamentModal
      createTournamentModal={isOpen}
      setCreateTournamentModal={setIsOpen}
    />
  );
}
