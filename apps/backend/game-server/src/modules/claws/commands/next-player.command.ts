import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { GAME_STATE } from '../state/room.state';
import { StartPlayerTurnCommand } from './start-turn.command';

export class SelectNextPlayerCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.gameState = GAME_STATE.CHOOSING;

    for (const player of this.state.players) {
      player.orderInQueue = player.orderInQueue - 1;
    }

    const nextPlayer = [...this.state.players].sort(
      (a, b) => a.orderInQueue - b.orderInQueue,
    )[0];

    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);

    this.state.currentPlayer = nextPlayer;
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
