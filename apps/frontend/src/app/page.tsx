'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const tiktokSocket = io('localhost:4444');
tiktokSocket.connect();
tiktokSocket.on('connect', () => {
  console.log('connected to tiktok live');
});
tiktokSocket.emit('listenToStream', 'leevv__123', (data) => {
  console.log('sent', data);
});

tiktokSocket.on('chat', (data) => {
  console.log('chat message', data);
});

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      Landing Page
      <Button size={'lg'} onClick={() => router.push('/games')}>
        Games
      </Button>
    </div>
  );
}
