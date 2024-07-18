import { Command, Dispatcher } from '@colyseus/command';

import { CLAWS_CONFIG } from './claws.config';
import { ClawsDirection } from './claws.player';
import { ClawsRoom } from './claws.room';
import { GameState } from './claws.state';

export class StartGameCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer = this.state.players[0];
    this.room.state.gameState = GameState.STARTED;
    this.state.startedAt = this.clock.currentTime;

    new Dispatcher(this.room).dispatch(new HandlePlayerTurnCommand());
  }
}

export class HandlePlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    console.log('Starting player turn');
    this.state.currentPlayer.startTurn();
    await this.clock.duration(CLAWS_CONFIG.PLAYER_TURN_DURATION);

    await new Dispatcher(this.room).dispatch(new MoveClawCommand(), {
      sessionId: this.state.currentPlayer.sessionId,
      direction: ClawsDirection.LEFT,
    });
    await new Dispatcher(this.room).dispatch(new MoveClawCommand(), {
      sessionId: this.state.currentPlayer.sessionId,
      direction: ClawsDirection.DROP,
    });

    this.state.currentPlayer.endTurn();
    console.log('Player turn ended');
    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);
    await new Dispatcher(this.room).dispatch(new SelectNextPlayerCommand());
  }

  validate() {
    return this.state.gameState === GameState.STARTED;
  }
}

type MoveClawCommandPayload = {
  sessionId: string;
  direction: ClawsDirection;
};
export class MoveClawCommand extends Command<
  ClawsRoom,
  MoveClawCommandPayload
> {
  validate({ sessionId, direction }: MoveClawCommandPayload) {
    const isGameStarted = this.state.gameState === GameState.STARTED;
    if (!isGameStarted) return false;

    const isPlayersTurn = this.state.currentPlayer.sessionId === sessionId;
    if (!isPlayersTurn) return false;

    const isValidDirection = Object.values(ClawsDirection).includes(direction);
    if (!isValidDirection) return false;

    return true;
  }

  async execute({ direction }) {
    console.log(`Moving claw ${direction}`);
    await this.state.currentPlayer.moveClaw(direction);
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
