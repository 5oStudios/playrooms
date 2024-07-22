'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ColyseusClient } from '../../lib/colyseus/colyseusClient';

type Room = {
  clients: number;
  maxClients: number;
  name: string;
  roomId: string;
};

// Page component
function Page() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const gameClient = new ColyseusClient();
  useEffect(() => {
    const fetchRooms = async () => {
      const availableRooms = await gameClient.getAvailableRooms();
      setRooms(availableRooms);
      console.log(availableRooms);
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center bg-primary h-[117px]">
        <p className="text-xl text-white font-bold">Claws Room</p>
      </div>
      <div className="flex-grow flex flex-wrap justify-start items-start mt-10">
        {rooms.map((room, index) => (
          <RoomCard key={index} roomClient={room} gameClient={gameClient} />
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

function RoomCard({
  roomClient,
  gameClient,
}: {
  roomClient: Room;
  gameClient: ColyseusClient;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-start items-start bg-primary w-56 h-56 rounded-xl p-4 m-2 text-white">
      <p>Name: {roomClient.name}</p>
      <p>RoomId: {roomClient.roomId}</p>
      <p>No of clients: {roomClient.clients}</p>
      <p>Max no of clients: {roomClient.maxClients}</p>
      <button
        className="bg-gradient-to-t from-secondary to-darkYellow w-full h-10 rounded-xl mt-auto mb-2"
        onClick={async () => {
          const playerData = await gameClient.joinById(roomClient.roomId);
          // router.push({})
        }}
      >
        Join
      </button>
    </div>
  );
}
