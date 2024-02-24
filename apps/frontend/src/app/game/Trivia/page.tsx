'use client';
import { Nakama } from '../../../components/nakama';
import { useTypedSelector } from '../../../hooks/use-redux-typed';
import React from 'react';
import Lobby from '../../../components/modals/lobby';

export default function Index() {
  const session = useTypedSelector((state) => state.auth.session);

  if (!session) return <Lobby />;

  console.log(session);
  return (
    <div className="flex justify-center items-center">
      <Nakama />
    </div>
  );
}
