import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AiOutlineUser, AiOutlineUserSwitch } from 'react-icons/ai';
import { IoArrowBack, IoEyeOutline } from 'react-icons/io5';

import eye from '../../../../../public/assets/eye.svg';
import users from '../../../../../public/assets/user.svg';
import { useAppSelector } from '../../../hooks';
import { selectMyPlayerState } from '../joinedRoomSlice';

// Import useRouter for navigation

export default function SingleRoomHeader() {
  const myPlayer = useAppSelector(selectMyPlayerState);
  const roomStatus = useAppSelector(
    (state) => state.rooms.joinedRoom.roomState?.gameState,
  );
  const playersCount = useAppSelector(
    (state) => state.rooms.joinedRoom.roomState?.players.length,
  );
  if (!myPlayer) return null;

  const { currentTurnTimerInSeconds } = myPlayer;

  const viewersCount = 0;
  const waiting = myPlayer.queueOrder;

  const router = useRouter(); // Initialize useRouter for navigation

  return (
    <div className="w-full p-4 bg-primary flex items-center">
      <button
        onClick={() => router.back()} // Navigate back on click
        className="text-white flex items-center gap-2 mr-auto"
      >
        <IoArrowBack className="w-6 h-6" />
        <span className="hidden md:inline">Back</span>
      </button>

      <div className="flex h-full gap-6 text-white flex-1 justify-center">
        <div className="flex gap-2 justify-center items-center">
          <AiOutlineUser className="w-6 h-6" />
          <p className="hidden md:block">Players</p>
          <p>{'(' + playersCount + ')'}</p>
        </div>

        <div className="bg-gray-300/50 w-[1px]" />

        <div className="flex gap-2 justify-center items-center">
          <IoEyeOutline className="w-6 h-6" />
          <p className="hidden md:block">Viewers</p>
          <p>{'(' + viewersCount + ')'}</p>
        </div>

        <div className="bg-gray-300/50 w-[1px]" />

        <div className="flex gap-2 justify-center items-center">
          <AiOutlineUserSwitch className="w-6 h-6" />
          <p className="hidden md:block">Waiting</p>
          <p>{'(' + waiting + ')'}</p>
        </div>
      </div>
    </div>
  );
}
