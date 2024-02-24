'use client';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { partyId: string } }) {
  const router = useRouter();
  const partyId = params.partyId;
  return (
    <div>
      <h1>Party</h1>
      <p>Party ID: {partyId}</p>
    </div>
  );
}
