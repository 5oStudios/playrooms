import React from 'react';

import Image from 'next/image';

import eye from '../../../../../public/assets/eye.svg';
import users from '../../../../../public/assets/user.svg';
import { useAppSelector } from '../../../hooks';

export default function SingleRoomHeader() {
  const currentTurnTimerInSeconds = useAppSelector(
    (state) => state.rooms.joinedRoom.myPlayerState?.currentTurnTimerInSeconds,
  );
  const playersCount = useAppSelector(
    (state) => state.rooms.joinedRoom.roomState?.players.length,
  );
  const viewersCount = 0;
  const waiting = 0;

  return (
    <div className="flex flex-col justify-end items-center w-full h-[117px] bg-primary">
      <div className="flex flex-col w-full h-full justify-end items-center">
        <div className="flex gap-6 mb-4">
          <div>{currentTurnTimerInSeconds}</div>

          <div className="bg-gray-300/50 w-[1px] h-full" />

          <div className="flex gap-2 text-white">
            <Image src={users} alt={'players'} />
            <p>Players</p>
            <p>{'(' + playersCount + ')'}</p>
          </div>

          <div className="bg-gray-300/50 w-[1px] h-full" />

          <div className="flex gap-2 text-white">
            <Image src={eye} alt={'viewers'} />
            <p>Viewers</p>
            <p>{'(' + viewersCount + ')'}</p>
          </div>

          <div className="bg-gray-300/50 w-[1px] h-full" />

          <div className="flex gap-2 text-white">
            <Image src={users} alt={'waiting'} />
            <p>waiting</p>
            <p>{'(' + waiting + ')'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
