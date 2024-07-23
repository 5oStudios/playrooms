import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { CLAWS_DIRECTION } from '../state/player.state';
import { GAME_STATE } from '../state/room.state';
import { MoveClawCommand } from './player/move-claw.command';

export class StartPlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.startTurn();

    const playerTurnTimer = this.clock.setTimeout(async () => {
      const didPlayerMove = this.state.currentPlayer.totalMovesThisRound > 0;

      // we need to preform any movement before dropping the claw
      if (!didPlayerMove) {
        await this.room.dispatcher.dispatch(new MoveClawCommand(), {
          sessionId: this.room.state.currentPlayer.sessionId,
          direction: CLAWS_DIRECTION.LEFT,
        });
      }

      await this.room.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: this.room.state.currentPlayer.sessionId,
        direction: CLAWS_DIRECTION.DROP,
      });
    }, CLAWS_CONFIG.PLAYER_TURN_DURATION);

    this.room.timers.set(this.state.currentPlayer.sessionId, playerTurnTimer);
  }

  validate() {
    const isGameStarted = this.state.gameState === GAME_STATE.STARTED;
    if (!isGameStarted) {
      return false;
    }

    const isCurrentPlayer = this.state.currentPlayer;
    if (!isCurrentPlayer) {
      return false;
    }

    return true;
  }
}
