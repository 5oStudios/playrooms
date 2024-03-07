'use client';
import { Suspense } from 'react'; // Import Suspense
import Match from '../../../../components/match/match';
import { useSearchParams } from 'next/navigation';

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

  return <Match ticket={ticket} token={token} />;
}
