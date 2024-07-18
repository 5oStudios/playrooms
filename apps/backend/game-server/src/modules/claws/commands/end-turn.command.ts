import { Command } from '@colyseus/command';

import { ClawsRoom } from '../claws.room';
import { SelectNextPlayerCommand } from './next-player.command';

export class EndTurnCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.endTurn();
    this.clock.clear();
    console.log('Player turn ended ', this.state.currentPlayer.sessionId);
    await this.room.dispatcher.dispatch(new SelectNextPlayerCommand());
  }
}
