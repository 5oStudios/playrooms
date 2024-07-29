import { Command } from '@colyseus/command';

import { ClawsRoom } from '../claws.room';
import { GAME_STATE } from '../state/room.state';
import { StartPlayerTurnCommand } from './start-turn.command';

export class StartGameCommand extends Command<ClawsRoom> {
  async execute() {
    this.room.state.gameState = GAME_STATE.STARTED;
    this.state.startedAt = this.clock.currentTime;

    this.state.currentPlayer = this.state.players.find(
      (player) => player.orderInQueue === 0,
    );
    await this.room.dispatcher.dispatch(new StartPlayerTurnCommand());
  }
}
