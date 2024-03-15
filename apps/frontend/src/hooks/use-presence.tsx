import { gameSocket } from '@core/game-client';
import { PlayerPresenceEvents } from './use-player';
import { usePubSub } from './use-pub-sub';
import { toast } from 'sonner';

export const usePresence = () => {
  const { publish, subscribe } = usePubSub();

  gameSocket.onmatchpresence = (matchPresence) => {
    matchPresence.joins &&
      matchPresence.joins.forEach((player) => {
        console.log('Player_joined', player);
        toast.success(`${player.username} joined the match`);
        publish(PlayerPresenceEvents.JOINED, player);
      });

    matchPresence.leaves &&
      matchPresence.leaves.forEach((player) => {
        console.log('Player_left', player);
        toast.error(`${player.username} left the match`);
        publish(PlayerPresenceEvents.LEFT, player);
      });
  };
};
