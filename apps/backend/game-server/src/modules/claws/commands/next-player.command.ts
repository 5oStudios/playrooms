import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { StartPlayerTurnCommand } from './start-turn.command';

export class SelectNextPlayerCommand extends Command<ClawsRoom> {
  async execute() {
    const currentPlayerIndex = this.state.players.indexOf(
      this.state.currentPlayer,
    );

    const nextPlayerIndex =
      (currentPlayerIndex + 1) % this.state.players.length;

    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);
    this.state.currentPlayer = this.state.players[nextPlayerIndex];
    await this.room.dispatcher.dispatch(new StartPlayerTurnCommand());
  }
}
