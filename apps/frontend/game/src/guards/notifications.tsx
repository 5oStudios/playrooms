import { toast } from 'sonner';

import { gameSocket } from '@kingo/game-client';

export function Notifications() {
  gameSocket.onpartypresence = (presence) => {
    console.log('onPartyPresence', presence);
    presence.joins &&
      presence.joins.forEach((join) => {
        toast.success(`${join.username} joined the party`);
      });
    presence.leaves &&
      presence.leaves.forEach((leave) => {
        toast.error(`${leave.username} left the party`);
      });
  };
}
