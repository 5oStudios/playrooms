import { Command, Dispatcher } from '@colyseus/command';

import { CLAWS_CONFIG } from './claws.config';
import { ClawsRoom } from './claws.room';
import { CLAWS_DIRECTION, ClawsPlayerState } from './state/player.state';
import { GAME_STATE } from './state/room.state';

export class StartGameCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer = this.state.players[0];
    this.room.state.gameState = GAME_STATE.STARTED;
    this.state.startedAt = this.clock.currentTime;

    new Dispatcher(this.room).dispatch(new HandlePlayerTurnCommand());
  }
}

export class HandlePlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    console.log('Starting player turn ', this.state.currentPlayer.sessionId);
    this.state.currentPlayer.startTurn();
    await this.clock.duration(CLAWS_CONFIG.PLAYER_TURN_DURATION);

    await new Dispatcher(this.room).dispatch(new MoveClawCommand(), {
      sessionId: this.state.currentPlayer.sessionId,
      direction: CLAWS_DIRECTION.LEFT,
    });
    await new Dispatcher(this.room).dispatch(new MoveClawCommand(), {
      sessionId: this.state.currentPlayer.sessionId,
      direction: CLAWS_DIRECTION.DROP,
    });
  }

  validate() {
    return this.state.gameState === GAME_STATE.STARTED;
  }
}

export class EndTurnCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.endTurn();
    console.log('Player turn ended ', this.state.currentPlayer.sessionId);
    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);
    await new Dispatcher(this.room).dispatch(new SelectNextPlayerCommand());
  }
}

type MoveClawCommandPayload = {
  sessionId: string;
  direction: CLAWS_DIRECTION;
};
export class MoveClawCommand extends Command<
  ClawsRoom,
  MoveClawCommandPayload
> {
  validate({ sessionId, direction }: MoveClawCommandPayload) {
    const isGameStarted = this.state.gameState === GAME_STATE.STARTED;
    if (!isGameStarted) return false;

    const isPlayersTurn = this.state.currentPlayer.sessionId === sessionId;
    if (!isPlayersTurn) return false;

    const isValidDirection = Object.values(CLAWS_DIRECTION).includes(direction);
    if (!isValidDirection) return false;

    const isMoving = this.state.currentPlayer.state === ClawsPlayerState.MOVING;
    if (isMoving) return false;

    return true;
  }

  async execute({ direction }) {
    console.log(
      `Moving claw ${direction} `,
      this.state.currentPlayer.sessionId,
    );
    await this.state.currentPlayer.moveClaw(direction);

    if (direction === CLAWS_DIRECTION.DROP) {
      await new Dispatcher(this.room).dispatch(new EndTurnCommand());
    }
  }
}

export class SelectNextPlayerCommand extends Command<ClawsRoom> {
  execute() {
    const currentPlayerIndex = this.state.players.indexOf(
      this.state.currentPlayer,
    );

    const nextPlayerIndex =
      (currentPlayerIndex + 1) % this.state.players.length;
    this.state.currentPlayer = this.state.players[nextPlayerIndex];

    new Dispatcher(this.room).dispatch(new HandlePlayerTurnCommand());
  }
}
