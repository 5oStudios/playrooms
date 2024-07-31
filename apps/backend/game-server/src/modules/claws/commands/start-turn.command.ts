import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { CLAWS_DIRECTION } from '../state/player.state';
import { GAME_STATE } from '../state/room.state';
import { EndPlayerTurn } from './end-player.turn';
import { MoveClawCommand } from './player/move-claw.command';

export class StartPlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.startTurn();

    const currentTurnTimer = this.clock.setInterval(() => {
      if (this.state.currentPlayer.currentTurnTimerInSeconds <= 0) {
        currentTurnTimer.clear();
        this.room.dispatcher.dispatch(new EndPlayerTurn());
      } else this.state.currentPlayer.currentTurnTimerInSeconds -= 1;
    }, 1000);
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
