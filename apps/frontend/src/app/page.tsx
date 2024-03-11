'use client';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import {
  ChatMessage,
  listenToStreamEventKey,
  TikTokLiveEvents,
  tiktokSocket,
} from '@core/tiktok-client';
import { useState } from 'react';

tiktokSocket.emit(listenToStreamEventKey, 'leevv__123', (data) => {
  console.log('sent', data);
});

export default function Index() {
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  tiktokSocket.on(TikTokLiveEvents.CHAT, (message: ChatMessage) => {
    console.log('received', message);
    setLastMessage(message);
  });
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {lastMessage && (
        <div>
          <h1>{lastMessage.nickname}</h1>
          <p>{lastMessage.comment}</p>
        </div>
      )}
      Landing Page
      <Button size={'lg'} onClick={() => router.push('/games')}>
        Games
      </Button>
    </div>
  );
}
