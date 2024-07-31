'use client';

import React, { useEffect } from 'react';

import { RoomAvailable } from 'colyseus.js';
import { useRouter } from 'next/navigation';

import { Spinner } from '../../components/spinner';
import WebView from '../../components/webView';
import { getAvailableRooms } from '../../lib/features/rooms/roomsSlice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';


const Page = () => {
  const dispatch = useAppDispatch();
  const { availableRooms, state, error } = useAppSelector(
    (state) => state.rooms.availableRooms,
  );

  useEffect(() => {
    if (state === 'idle') dispatch(getAvailableRooms());
  }, [dispatch, state]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-center items-center bg-primary h-28">
        <h1 className="text-2xl text-white font-bold">Available Rooms</h1>
      </header>

      <main className="flex-grow p-4">
        {state === 'loading' && <Spinner />}

        {state === 'failed' && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {state === 'succeeded' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableRooms.map((room) => (
              <RoomCard key={room.roomId} {...room} />
            ))}
          </div>
        )}
      </main>

      <footer className="flex justify-center items-center bg-primary h-28">
        <button className="text-white bg-gradient-to-t from-secondary to-darkYellow w-80 h-14 rounded-3xl flex items-center justify-center">
          Create Room
        </button>
      </footer>
    </div>
  );
};

export default Page;

const RoomCard = ({ roomId, maxClients, clients, metadata }: RoomAvailable) => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-primary p-4 rounded-xl text-white w-full h-full shadow-lg">
      <p className="mb-2">
        Players {clients} / {maxClients}
      </p>
      <div className="flex-grow mb-4">
        <WebView url={metadata.streamUrl} />
      </div>
      <button
        className="bg-gradient-to-t from-secondary to-darkYellow w-full h-10 rounded-xl mt-auto"
        onClick={() => router.push(`/rooms/${roomId}`)}
      >
        Join
      </button>
    </div>
  );
};
