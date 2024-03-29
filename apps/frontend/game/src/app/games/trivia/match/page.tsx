'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Match from '@components/match/match';
import { useAppSelector } from '@hooks/use-redux-typed';
import { SocketState } from '@store/features/socketSlice';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TriviaMatch />
    </Suspense>
  );
}

function TriviaMatch() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');
  const socket = useAppSelector((state) => state.socket);
  if (socket !== SocketState.CONNECTED) return null;

  return <Match ticket={ticket} token={token} />;
}
