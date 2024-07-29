import { Command } from '@colyseus/command';

import { ClawsRoom } from '../../claws.room';
import { PlayerState } from '../../state/player.state';

export class AddPlayerCommand extends Command<ClawsRoom, PlayerState> {
  validate(player: PlayerState) {
    const isUnique = !this.state.players.some((p) => p.email === player.email);
    if (!isUnique) {
      this.room.clients.getById(player.sessionId).send('error', {
        message: 'Player with this email already exists',
      });
      this.room.clients.getById(player.sessionId).leave();
    }
    return isUnique;
  }

  execute(player: PlayerState) {
    player.orderInQueue = this.state.players.length;
    this.state.players.push(player);
  }
}
