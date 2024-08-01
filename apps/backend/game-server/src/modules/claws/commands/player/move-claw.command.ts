import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { ClawsRoom } from '../../claws.room';
import { CLAWS_DIRECTION } from '../../state/player.state';
import { EndPlayerTurn } from '../end-player.turn';

type MoveClawCommandPayload = {
  sessionId: Client['sessionId'];
  direction: CLAWS_DIRECTION;
  forceAction?: boolean;
};

export class MoveClawCommand extends Command<
  ClawsRoom,
  MoveClawCommandPayload
> {
  validate({ sessionId, direction, forceAction }: MoveClawCommandPayload) {
    if (forceAction) return true;

    const isCurrentPlayer = this.state.currentPlayer?.sessionId === sessionId;
    if (!isCurrentPlayer) return false;

    const isMyTurn = this.state.currentPlayer.isMyTurn;
    if (!isMyTurn) return false;

    const isValidDirection = Object.values(CLAWS_DIRECTION).includes(direction);
    if (!isValidDirection) return false;

    // const isMoving = this.state.currentPlayer.state === ClawsPlayerState.MOVING;
    // if (isMoving) return false;

    return true;
  }

  async execute({ direction }) {
    console.log('MoveClawCommand', direction);
    if (direction === CLAWS_DIRECTION.DROP) {
      await this.state.currentPlayer.dropClaw();
      await this.room.dispatcher.dispatch(new EndPlayerTurn());
    } else {
      await this.state.currentPlayer.moveClaw(direction);
    }
  }
}
