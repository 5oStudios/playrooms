import { Command } from '@colyseus/command';

import { CLAWS_CONFIG } from '../claws.config';
import { ClawsRoom } from '../claws.room';
import { CLAWS_DIRECTION } from '../state/player.state';
import { GAME_STATE } from '../state/room.state';
import { MoveClawCommand } from './move-claw.command';

export class StartPlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    console.log('Starting player turn ', this.state.currentPlayer.sessionId);
    this.state.currentPlayer.startTurn();

    this.clock.setTimeout(async () => {
      console.log(
        'Automatically dropping claw ',
        this.state.currentPlayer.sessionId,
      );
      await this.room.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: this.room.state.currentPlayer.sessionId,
        direction: CLAWS_DIRECTION.DROP,
      });
    }, CLAWS_CONFIG.PLAYER_TURN_DURATION);
  }

  validate() {
    return this.state.gameState === GAME_STATE.STARTED;
  }
}
