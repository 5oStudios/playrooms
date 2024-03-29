'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { Match } from '@components';
import { useAppSelector } from '@hooks';
import { SocketState } from '@store';

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
