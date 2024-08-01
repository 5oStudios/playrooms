import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { ClawsRoom } from '../../claws.room';
import { CLAWS_DIRECTION } from '../../state/player.state';
import { AutoEndPlayerTurn } from '../auto-end-player.turn';
import { SelectNextPlayerCommand } from '../next-player.command';

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
    if (direction === CLAWS_DIRECTION.DROP) {
      console.count('dropping');
      const thisPlayerClient = this.room.clients.find(
        (client) => client.sessionId === this.state.currentPlayer.sessionId,
      );
      if (!thisPlayerClient) {
        throw new Error('Client not found');
      }
      const result = await this.state.currentPlayer.dropClaw();
      if (result === 'lose') {
        console.count('lose');
        thisPlayerClient.send('drop-state', 'lose');
      } else {
        console.count('win');
        thisPlayerClient.send('drop-state', 'win');
      }
      // await this.room.dispatcher.dispatch(new AutoEndPlayerTurn());
      this.state.currentPlayer.endTurn();
      await this.room.dispatcher.dispatch(new SelectNextPlayerCommand());
    } else {
      await this.state.currentPlayer.moveClaw(direction);
    }
  }
}
