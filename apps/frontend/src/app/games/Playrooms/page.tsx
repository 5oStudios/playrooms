import Game from '../../../components/game';
import dynamic from 'next/dynamic';

const LazyLoadedGame = dynamic(async () => Game, {
  ssr: false,
});

export default function Index() {
  return (
    <div className="flex justify-center items-center">
      <LazyLoadedGame />
    </div>
  );
}
