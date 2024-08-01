'use client';

import { useState } from 'react';

import { Button } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import 'react-modern-drawer/dist/index.css';

import { Controls } from '../components/controls';
import Drawer from '../components/drawer/drawer';
import VideoControl from '../components/videoControl';
import VideoPlayer from '../components/videoPlayer';
import WebView from '../components/webView';
import SingleRoomHeader from '../lib/features/rooms/components/singleRoomHeader';

export default function Index() {
  // const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
  //   ssr: false,
  // });
  //
  // const searchParams = useSearchParams();
  // const youtubeId = searchParams.get('yt');
  //
  // const [mute, setMute] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [title, setTitle] = useState('Join Play');
  //
  // const toggleDrawer = () => {
  //   setIsOpen((prevState) => !prevState);
  // };
  //
  // return (
  //   <div className="flex flex-col h-screen">
  //     Landing Page
  //     <Button type="primary">Primary Button</Button>
  //   </div>
  // );

  const router = useRouter();
  router.push('/rooms');
}
