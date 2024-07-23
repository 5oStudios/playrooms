'use client';

import { useEffect, useState } from 'react';

import { Room } from 'colyseus.js';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import 'react-modern-drawer/dist/index.css';

import { gameClient } from '@kingo/game-client';

import { Controls } from '../../../components/controls';
import Header from '../../../components/header';
import VideoControl from '../../../components/videoControl';
import WebView from '../../../components/webView';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  // const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
  //   ssr: false,
  // });
  // const youtubeId = searchParams.get('yt');
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Join Play');
  const [mute, setMute] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log('room', room?.state.maxClients);

  useEffect(() => {
    gameClient
      .joinById(params.roomId)
      .then(setRoom)
      .catch(({ message }) => setError(message));

    return () => {
      room?.leave();
    };
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header viewers={0} waiting={room?.state?.maxClients} />
      <div className="relative flex-grow ">
        <VideoControl setMute={setMute} mute={mute} />
        {/* <VideoPlayer youtubeId={youtubeId} mute={mute} /> */}
        <WebView url="https://cam.mshemali.dev/" />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center bg-white p-4">
        <Controls
          actions={{
            drop: () => room?.send('move-claw', { direction: 'drop' }),
            up: () => room?.send('move-claw', { direction: 'up' }),
            down: () => room?.send('move-claw', { direction: 'down' }),
            left: () => room?.send('move-claw', { direction: 'left' }),
            right: () => room?.send('move-claw', { direction: 'right' }),
          }}
        />

        <button
          className="mt-4 flex justify-center items-center button-gradient-border w-[380px] h-[58px]"
          onClick={() => {
            setTitle('Queue Board');
            toggleDrawer();
          }}
        >
          Queue Board
        </button>
      </footer>
    </div>
  );
}
