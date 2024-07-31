import React from 'react';

import { PlayerState } from '@kingo/game-client';

import { useAppSelector } from '../../../../hooks';
import QueueCard from './card';

export default function QueueBoard() {
  const players = useAppSelector(
    (state) => state.rooms.joinedRoom.roomState?.players,
  );
  const myPlayer = useAppSelector(
    (state) => state.rooms.joinedRoom.myPlayerState,
  );

  if (!players)
    return (
      <div className="flex flex-col items-center justify-center h-[100px]">
        <p className="text-[16px] font-urbanist">No players in the queue</p>
      </div>
    );

  return (
    <div className="overflow-y-auto w-[90%]">
      {players
        .sort((a, b) => b.totalWins - a.totalWins)
        .map((player, index) => (
          <>
            {index === 0 && (
              <div className="bg-slate-200 w-full mt-2 h-[1px] mx-auto"></div>
            )}
            <QueueCard
              id={index}
              images={undefined}
              name={player.name}
              points={player.totalWins}
              isMyPlayer={player.sessionId === myPlayer?.sessionId}
            />
            <div className="bg-slate-200 w-full h-[1px] mx-auto"></div>
          </>
        ))}
    </div>
  );
}
