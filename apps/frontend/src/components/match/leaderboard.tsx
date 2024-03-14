import { useAppSelector } from '../../hooks/use-redux-typed';

export function Leaderboard() {
  const myPlayer = useAppSelector((state) => state.players.myPlayer);
  const otherPlayer = useAppSelector((state) => state.players.otherPlayers);

  const allPlayers = [myPlayer, ...otherPlayer];

  return (
    <div>
      Leaderboard
      <ul>
        {allPlayers.map((player) => (
          <li key={player.id}>
            {player.username} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
