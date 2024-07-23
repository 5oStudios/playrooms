import React from 'react';

import { PlayerState } from '@kingo/game-client';

import { generateRandomUser } from '../../../app/mock/generateRandomUsers';
import QueueCard from './card';

export default function QueueBoard({ players }: { players: PlayerState[] }) {
  return (
    <div className="overflow-y-auto w-[90%]">
      {players
        .sort((a, b) => b.totalWins - a.totalWins)
        .map((user, index) => (
          <>
            {index === 0 && (
              <div className="bg-slate-200 w-full mt-2 h-[1px] mx-auto"></div>
            )}
            <QueueCard
              id={index}
              images={undefined}
              name={user.name}
              points={user.totalWins}
            />
            <div className="bg-slate-200 w-full h-[1px] mx-auto"></div>
          </>
        ))}
    </div>
  );
}
