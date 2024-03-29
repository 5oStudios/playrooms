import { toast } from 'sonner';

import { publish } from '@kingo/events';
import { gameSocket } from '@kingo/game-client';

import { PLAYER_PRESENCE } from './use-player';

export const usePresence = () => {
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
