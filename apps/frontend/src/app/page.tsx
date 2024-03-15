'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Leaderboard } from '../components/match/leaderboard';

export default function Index() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      Landing Page
      <Button size={'lg'} onClick={() => router.push('/games')}>
        Games
      </Button>
      <Leaderboard />
    </div>
  );
}
