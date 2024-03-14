import { useAppSelector } from '../../hooks/use-redux-typed';

export function Leaderboard() {
  const myScore = useAppSelector((state) => state.players.myPlayer.score);
  return (
    <div>
      Leaderboard
      <div>My Score: {myScore}</div>
    </div>
  );
}
