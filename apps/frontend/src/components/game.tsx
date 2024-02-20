'use client';
import { onPlayerJoin, setState } from 'playroomkit';

export default function Game() {
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin({
      matchmaking: true,
      turnBased: true,
      defaultPlayerStates: {
        score: 0,
      },
    });
  })();

  // Handle players joining the game
  onPlayerJoin((player) => {
    console.log(`${player.getProfile().name} joined the game`);

    player.onQuit(() => {
      console.log(`${player.getProfile().name} quit the game`);
    });
  });
  setState('timeLeft', 60);
}
