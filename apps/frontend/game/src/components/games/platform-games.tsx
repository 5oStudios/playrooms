'use client';

import React from 'react';

import { Chip } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '../../hooks/use-redux-typed';
import { AnimatedGameCard } from './animated-game-card';

export function PlatformGames() {
  const games = useAppSelector((state) => state.platform.games);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-12 md:gap-0 md:flex-row items-center justify-center max-w-lg">
      {games.map((game) => (
        <AnimatedGameCard
          key={nanoid()}
          title={game.title.charAt(0).toUpperCase() + game.title.slice(1)}
          description={game.description}
          href={'/games/' + encodeURIComponent(game.title)}
          onClick={() =>
            router.push('/games/' + encodeURIComponent(game.title))
          }
          chip={
            <Chip
              variant="shadow"
              classNames={{
                base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
                content: 'drop-shadow shadow-black text-white',
              }}
            >
              {game.chip}
            </Chip>
          }
        />
      ))}
    </div>
  );
}
