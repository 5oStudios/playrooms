import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { ClawsRoom } from '../claws.room';
import { CLAWS_DIRECTION } from '../state/player.state';
import { EndTurnCommand } from './end-turn.command';

type MoveClawCommandPayload = {
  sessionId: Client['sessionId'];
  direction: CLAWS_DIRECTION;
};
export class MoveClawCommand extends Command<
  ClawsRoom,
  MoveClawCommandPayload
> {
  validate({ sessionId, direction }: MoveClawCommandPayload) {
    const isCurrentPlayer = this.state.currentPlayer.sessionId === sessionId;
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
    console.log(
      `Moving claw ${direction} `,
      this.state.currentPlayer.sessionId,
    );
    await this.state.currentPlayer.moveClaw(direction);

    if (direction === CLAWS_DIRECTION.DROP) {
      await this.room.dispatcher.dispatch(new EndTurnCommand());
    }
  }
}
