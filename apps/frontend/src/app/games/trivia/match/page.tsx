'use client';
import { Suspense } from 'react'; // Import Suspense
import Match from '../../../../components/match/match';
import { useSearchParams } from 'next/navigation';
import { SocketState } from '../../../../store/features/socketSlice';
import { useAppSelector } from '../../../../hooks/use-redux-typed';

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
