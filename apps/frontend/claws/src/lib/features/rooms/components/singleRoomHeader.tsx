import React from 'react';

import Image from 'next/image';
import { AiOutlineUser } from 'react-icons/ai';
import { AiOutlineUserSwitch } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

import eye from '../../../../../public/assets/eye.svg';
import users from '../../../../../public/assets/user.svg';
import { useAppSelector } from '../../../hooks';
import { selectMyPlayerState } from '../joinedRoomSlice';

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

  return (
    <div className="w-full  p-4  bg-primary flex justify-center items-center">
      <div className="flex h-full gap-6 text-white">
        {/*<p>{currentTurnTimerInSeconds}</p>*/}
        {/*<div className="bg-gray-300/50 w-[1px] " />*/}

        <div className="flex gap-2 justify-center items-center">
          <AiOutlineUser className={'w-6 h-6'} />
          <p className="hidden md:block">Players</p>
          <p>{'(' + playersCount + ')'}</p>
        </div>

        <div className="bg-gray-300/50 w-[1px] " />

        <div className="flex gap-2 justify-center items-center">
          <IoEyeOutline className={'w-6 h-6'} />
          <p className="hidden md:block">Viewers</p>
          <p>{'(' + viewersCount + ')'}</p>
        </div>

        <div className="bg-gray-300/50 w-[1px] " />

        <div className="flex gap-2 justify-center items-center">
          <AiOutlineUserSwitch className={'w-6 h-6'} />
          <p className="hidden md:block">waiting</p>
          <p>{'(' + waiting + ')'}</p>
        </div>

        {/*<div className="bg-gray-300/50 w-[1px] " />*/}
        {/*<p>{roomStatus}</p>*/}
      </div>
    </div>
  );
}
