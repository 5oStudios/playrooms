import { toast } from 'sonner';
import { myPlayer, onPlayerJoin, PlayerState, setState } from 'playroomkit';
import { useEffect } from 'react';

export function InitRoom() {
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin(
      {
        matchmaking: true,
        turnBased: true,
        reconnectGracePeriod: 10000,
        defaultPlayerStates: {
          score: 0,
        },
      },
      () => setState('isGameStarted', true),
      (error) => toast.error(error.message)
    );
  })();

  useEffect(() => {
    const handlePlayerJoin = (player: PlayerState) => {
      console.log(player);
      const isOtherPlayer = player.id !== myPlayer()?.id;
      if (isOtherPlayer) {
        toast(`${player.getProfile()?.name} joined the game`);
      }

      player.onQuit(() => {
        if (isOtherPlayer) {
          toast(`${player.getProfile()?.name} left the game`);
        }
      });
    };

    onPlayerJoin(handlePlayerJoin);
  }, []);
}
