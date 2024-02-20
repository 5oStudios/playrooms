'use client';
import { getState, me, onPlayerJoin, setState } from 'playroomkit';
import { toast } from 'sonner';

export default function Game() {
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin({
      matchmaking: true,
      turnBased: true,
      reconnectGracePeriod: 10000,
      defaultPlayerStates: {
        score: 0,
      },
    });
  })();

  // Handle players joining the game
  onPlayerJoin((player) => {
    const isOtherPlayer = player.getProfile().name !== me().getProfile().name;
    if (isOtherPlayer) {
      toast(`${player.getProfile().name} joined the game`);
    }
    setState('timeLeft', 60);

    player.onQuit(() => {
      if (isOtherPlayer) {
        toast(`${player.getProfile().name} left the game`);
      }
    });
  });

  const timeLeft = getState('timeLeft');
  console.log('Time left:', timeLeft);
  return (
    <div>
      <h1>Game</h1>
    </div>
  );
}
