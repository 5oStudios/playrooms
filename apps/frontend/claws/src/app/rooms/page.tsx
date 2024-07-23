'use client';

import React, { useEffect, useState } from 'react';

import { Room, RoomAvailable } from 'colyseus.js';
import { useRouter } from 'next/navigation';

import { gameClient } from '@kingo/game-client';

function Page() {
  const [rooms, setRooms] = useState<RoomAvailable[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const availableRooms = await gameClient.getAvailableRooms();
      setRooms(availableRooms);
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center bg-primary h-[117px]">
        <p className="text-xl text-white font-bold">Claws Room</p>
      </div>
      <div className="flex-grow flex flex-wrap justify-start items-start mt-10">
        {rooms.map((room) => (
          <RoomCard {...room} />
        ))}
      </div>
      <footer className="flex justify-center items-center bg-primary h-[117px]">
        <button className="text-white bg-gradient-to-t from-secondary to-darkYellow w-[380px] h-[58px] rounded-3xl flex items-center justify-center">
          Create Room
        </button>
      </footer>
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
      <button
        className="bg-gradient-to-t from-secondary to-darkYellow w-full h-10 rounded-xl mt-auto mb-2"
        onClick={() => router.push(`/rooms/${roomId}`)}
      >
        Join
      </button>
    </div>
  );
}
