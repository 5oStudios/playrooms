import { toast } from 'sonner';
import { myPlayer, onPlayerJoin, PlayerState, setState } from 'playroomkit';
import { useEffect } from 'react';

export enum ROOM_STATE {
  LOADING = 'loading',
  READY = 'ready',
}

export const ROOM_STATE_KEY = 'roomState';

export function InitRoom() {
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin(
      {
        matchmaking: true,
        turnBased: true,
        reconnectGracePeriod: 10000,
        defaultPlayerStates: {
          playerScore: 0,
        },
      },
      () => setState(ROOM_STATE_KEY, ROOM_STATE.READY),
      (error) => toast.error(error.message)
    );
  })();

  useEffect(() => {
    const handlePlayerJoin = (player: PlayerState) => {
      console.log(player);
      const isOtherPlayer = player.id !== myPlayer()?.id;
      if (isOtherPlayer) {
        toast(`${player.getProfile()?.name} joined the room`);
      }

      player.onQuit(() => {
        if (isOtherPlayer) {
          toast(`${player.getProfile()?.name} left the room`);
        }
      });
    };

    onPlayerJoin(handlePlayerJoin);
  }, []);
}
