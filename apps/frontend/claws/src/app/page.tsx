'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import 'react-modern-drawer/dist/index.css';

import { Controls } from '../components/controls';
import Drawer from '../components/drawer/drawer';
import Header from '../components/header';
import VideoControl from '../components/videoControl';
import VideoPlayer from '../components/videoPlayer';

export default function Index() {
  const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
    ssr: false,
  });

  const searchParams = useSearchParams();
  const youtubeId = searchParams.get('yt');

  const [mute, setMute] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Join Play');

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header viewers={20} waiting={20} />
      <div className="relative flex-grow">
        <VideoPlayer youtubeId={youtubeId} mute={mute} />
        <VideoControl setMute={setMute} mute={mute} />
      </div>
      <Controls />
      {/* footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center bg-white p-4">
        <button
          className="bg-gradient-to-t from-secondary to-darkYellow w-[380px] h-[58px] rounded-3xl"
          onClick={() => {
            setTitle('Join Play');
            toggleDrawer();
          }}
        >
          Join Play
        </button>
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
      <Drawer isOpen={isOpen} toggleDrawer={toggleDrawer} title={title} />
    </div>
  );
}
