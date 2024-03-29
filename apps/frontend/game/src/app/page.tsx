'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Landing Page
      </p>
      <Button size={'lg'} onClick={() => router.push('/games')}>
        Games
      </Button>
    </div>
  );
}
