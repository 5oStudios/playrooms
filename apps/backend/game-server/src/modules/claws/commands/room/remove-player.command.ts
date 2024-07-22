import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { ClawsRoom } from '../../claws.room';

export class RemovePlayerCommand extends Command<ClawsRoom, Client> {
  validate(client: Client) {
    return this.state.existsInPlayers(client.userData.email);
  }

  execute(client: Client) {
    this.state.removedPlayers.push(client.userData);
    this.state.removeFromPlayers(client.sessionId);
    client.send('error', { message: 'You have been disconnected' });
  }
}
