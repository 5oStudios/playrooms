import dynamic from 'next/dynamic';
import Game from '../components/game';
import PlatformGames from '../components/games/platform-games';

const LazyLoadedGame = dynamic(async () => Game, {
  ssr: false,
});

export default function Index() {
  return (
    <div className="flex justify-center items-center">
      {/*<LazyLoadedGame />*/}
      {/*<Nakama />*/}
      <PlatformGames />
    </div>
  );
}
