'use client';
import { useTypedSelector } from '../../hooks/use-redux-typed';
import { AnimatedGameCard } from './animated-game-card';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { Chip } from '@nextui-org/react';
import React from 'react';

export default function PlatformGames() {
  const games = useTypedSelector((state) => state.platform.games);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-12 md:gap-0 md:flex-row items-center justify-center w-full">
      {games.map((game) => (
        <AnimatedGameCard
          key={nanoid()}
          title={game.title}
          description={game.description}
          href={'/game/' + game.title}
          onClick={() => router.push('/game/' + game.title)}
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
