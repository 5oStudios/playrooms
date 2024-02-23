import dynamic from 'next/dynamic';
import Game from '../components/game';
import { Nakama } from '../components/nakama';

const LazyLoadedGame = dynamic(async () => Game, {
  ssr: false,
});

export default function Index() {
  return (
    <div className="flex justify-center items-center">
      {/*<LazyLoadedGame />*/}
      <Nakama />
    </div>
  );
}
