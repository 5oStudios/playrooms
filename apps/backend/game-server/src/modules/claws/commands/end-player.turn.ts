import { Command } from '@colyseus/command';

import { ClawsRoom } from '../claws.room';
import { SelectNextPlayerCommand } from './next-player.command';

export class EndPlayerTurn extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.endTurn();

    await this.room.dispatcher.dispatch(new SelectNextPlayerCommand());
  }
}
