'use client';

import React from 'react';

import { RoomAvailable } from 'colyseus.js';
import { useRouter } from 'next/navigation';

import WebView from '../../components/webView';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { getAvailableRooms } from '../../features/rooms/roomsSlice';

function Page() {
  const dispatch = useAppDispatch();
  const { availableRooms, state, error } = useAppSelector(
    (state) => state.rooms.availableRooms,
  );

  React.useEffect(() => {
    if (state === 'idle') dispatch(getAvailableRooms());
  }, [dispatch, state]);

  if (state === 'loading') {
    return <div>Loading...</div>;
  }

  if (state === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-grow flex flex-wrap justify-start items-start mt-10">
      {availableRooms.map((room) => (
        <RoomCard key={room.roomId} {...room} />
      ))}
    </div>
  );
}

export default Page;

function RoomCard({ roomId, maxClients, clients, metadata }: RoomAvailable) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-start items-start bg-primary w-56 h-56 rounded-xl p-4 m-2 text-white">
      <p>
        Players {clients} / {maxClients}
      </p>
      <WebView url={metadata.streamUrl} />
      <button
        className="bg-gradient-to-t from-secondary to-darkYellow w-full h-10 rounded-xl mt-auto mb-2"
        onClick={() => router.push(`/rooms/${roomId}`)}
      >
        Join
      </button>
    </div>
  );
}
