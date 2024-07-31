import { Command } from '@colyseus/command';

import { ClawsRoom } from '../claws.room';
import { CLAWS_DIRECTION } from '../state/player.state';
import { SelectNextPlayerCommand } from './next-player.command';
import { MoveClawCommand } from './player/move-claw.command';

export class EndPlayerTurn extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.endTurn();

    const didPlayerMove = this.state.currentPlayer.totalMovesThisRound > 0;

    // We need to perform any movement before dropping the claw
    if (!didPlayerMove) {
      await this.room.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: this.room.state.currentPlayer.sessionId,
        direction: CLAWS_DIRECTION.LEFT,
        forceAction: true,
      });
    }

    await this.room.dispatcher.dispatch(new MoveClawCommand(), {
      sessionId: this.room.state.currentPlayer.sessionId,
      direction: CLAWS_DIRECTION.DROP,
      forceAction: true,
    });

    await this.room.dispatcher.dispatch(new SelectNextPlayerCommand());
  }
  validate() {
    return this.state.currentPlayer.isMyTurn;
  }
}
