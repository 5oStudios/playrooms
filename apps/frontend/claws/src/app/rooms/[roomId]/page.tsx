'use client';

import { useEffect, useState } from 'react';

import 'react-modern-drawer/dist/index.css';

import { Controls } from '../../../components/controls';
import Drawer from '../../../components/drawer/drawer';
import WebView from '../../../components/webView';
import QueueBoard from '../../../lib/features/rooms/components/queueBoard';
import SingleRoomHeader from '../../../lib/features/rooms/components/singleRoomHeader';
import {
  joinRoomById,
  leaveRoom,
  selectJoinedRoom,
} from '../../../lib/features/rooms/joinedRoomSlice';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mute, setMute] = useState(false);
  const toggleDrawer = () => setIsOpen((prevState) => !prevState);

  const dispatch = useAppDispatch();
  const { roomState, status, error } = useAppSelector(
    (state) => state.rooms.joinedRoom,
  );

  useEffect(() => {
    if (status === 'idle') dispatch(joinRoomById(params.roomId));
    return () => {
      dispatch(leaveRoom());
    };
  }, [dispatch, params.roomId, status]);

  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!roomState)
    return (
      <div className="flex justify-center items-center h-screen">
        Unknown error
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <SingleRoomHeader />
      <div className="flex-grow relative">
        <WebView url={roomState.streamUrl} />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center bg-white p-4 shadow-md">
        <Controls />
        <button
          className="mt-4 flex justify-center items-center button-gradient-border w-[380px] h-[58px]"
          onClick={toggleDrawer}
        >
          Queue Board
        </button>
        <Drawer isOpen={isOpen} toggleDrawer={toggleDrawer} title="Queue Board">
          <QueueBoard />
        </Drawer>
      </footer>
    </div>
  );
}
