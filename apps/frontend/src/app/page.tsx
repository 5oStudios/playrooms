import dynamic from 'next/dynamic';
import React from 'react';
import Game from '../components/game';

const LazyLoadedGame = dynamic(async () => Game, {
  ssr: false,
});

export default function Index() {
  return (
    <div>
      <LazyLoadedGame />
    </div>
  );
}
