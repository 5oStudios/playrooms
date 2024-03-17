import { gameSocket } from '@core/game-client';
import { PLAYER_PRESENCE } from './use-player';
import { usePubSub } from './use-pub-sub';
import { toast } from 'sonner';

export const usePresence = () => {
  const { publish, subscribe } = usePubSub();

  gameSocket.onmatchpresence = (matchPresence) => {
    matchPresence.joins &&
      matchPresence.joins.forEach((player) => {
        console.log('Player_joined', player);
        toast.success(`${player.username} joined the match`);
        publish(PLAYER_PRESENCE.JOINED, player);
      });

    matchPresence.leaves &&
      matchPresence.leaves.forEach((player) => {
        console.log('Player_left', player);
        toast.error(`${player.username} left the match`);
        publish(PLAYER_PRESENCE.LEFT, player);
      });
  };
};
