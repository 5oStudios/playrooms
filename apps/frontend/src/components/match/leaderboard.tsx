import { useAppSelector } from '../../hooks/use-redux-typed';

export function Leaderboard() {
  const players = useAppSelector((state) => state.players);

  return (
    <div>
      Leaderboard
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.username}: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
