'use client';

import { useEffect, useState } from 'react';

import 'react-modern-drawer/dist/index.css';

import { Controls } from '../../../components/controls';
import Drawer from '../../../components/drawer/drawer';
import QueueBoard from '../../../components/drawer/queueBoard';
import Header from '../../../components/header';
import WebView from '../../../components/webView';
import {
  joinRoomById,
  leaveRoom,
  selectJoinedRoom,
} from '../../../lib/features/rooms/joinedRoomSlice';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { calcWaitingQueue } from './useClawsRoom';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  // const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
  //   ssr: false,
  // });
  // const youtubeId = searchParams.get('yt');
  const [isOpen, setIsOpen] = useState(false);
  const [mute, setMute] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const dispatch = useAppDispatch();
  const joinedRoom = useAppSelector(selectJoinedRoom);
  const { roomState, myPlayerState, status, error } = joinedRoom;

  useEffect(() => {
    if (status === 'idle') dispatch(joinRoomById(params.roomId));

    return () => {
      dispatch(leaveRoom());
    };
  }, []);

  if (status === 'failed') {
    return <div>{error}</div>;
  }
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!roomState) return <div>Unknown error</div>;
  console.log('players', roomState.players.length);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {roomState.players.length}
      <Header
        viewers={0}
        waiting={calcWaitingQueue(roomState.players.length)}
      />
      <div className="relative flex-grow ">
        {/*<VideoControl setMute={setMute} mute={mute} />*/}
        {/* <VideoPlayer youtubeId={youtubeId} mute={mute} /> */}
        <WebView url={roomState.streamUrl} />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center bg-white p-4">
        <Controls
          isMyTurn={myPlayerState?.isMyTurn}
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
            toggleDrawer();
          }}
        >
          Queue Board
        </button>
        <Drawer
          isOpen={isOpen}
          toggleDrawer={toggleDrawer}
          title={'Queue Board'}
        >
          <QueueBoard players={roomState.players} />
        </Drawer>
      </footer>
    </div>
  );
}
