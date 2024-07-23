import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { GAME_STATE } from '../state/room.state';
import { StartPlayerTurnCommand } from './start-turn.command';

export class SelectNextPlayerCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.gameState = GAME_STATE.CHOOSING;
    const currentPlayerIndex = this.state.players.indexOf(
      this.state.currentPlayer,
    );

    this.state.nextPlayerIndex =
      (currentPlayerIndex + 1) % this.state.players.length;

    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);

    this.state.currentPlayer = this.state.players[this.state.nextPlayerIndex];
    this.state.gameState = GAME_STATE.STARTED;
    await this.room.dispatcher.dispatch(new StartPlayerTurnCommand());
  }

  validate() {
    const isGameStarted = this.state.gameState === GAME_STATE.STARTED;
    if (!isGameStarted) return false;

    const playersCount = this.state.players.length;
    if (playersCount === 0) return false;

    return true;
  }
}
