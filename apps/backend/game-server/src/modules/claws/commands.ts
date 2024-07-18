import { Command, Dispatcher } from '@colyseus/command';

import { CLAWS_CONFIG } from './claws.config';
import { ClawsRoom } from './claws.room';

export class StartGameCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer = this.state.players[0];
    this.room.state.gameState = 'started';
    this.state.startedAt = this.clock.currentTime;

    new Dispatcher(this.room).dispatch(new HandlePlayerTurnCommand());
  }
}

export class HandlePlayerTurnCommand extends Command<ClawsRoom> {
  async execute() {
    this.state.currentPlayer.startTurn();
    await this.clock.duration(CLAWS_CONFIG.PLAYER_TURN_DURATION);
    new Dispatcher(this.room).dispatch(new MoveClawCommand(), {
      sessionId: this.state.currentPlayer.sessionId,
      direction: 'down',
    });
    await this.clock.duration(CLAWS_CONFIG.TIMEOUT_BEFORE_NEXT_TURN);
    await new Dispatcher(this.room).dispatch(new SelectNextPlayerCommand());
  }

  validate() {
    return this.state.gameState === 'started';
  }
}

export class MoveClawCommand extends Command<
  ClawsRoom,
  { sessionId: string; direction: string }
> {
  validate({ sessionId, direction }: { sessionId: string; direction: string }) {
    const isGameStarted = this.state.gameState === 'started';
    if (!isGameStarted) return false;

    const isPlayersTurn = this.state.currentPlayer.sessionId === sessionId;
    if (!isPlayersTurn) return false;

    const isValidDirection = ['up', 'down', 'left', 'right'].includes(
      direction,
    );
    if (!isValidDirection) return false;

    return true;
  }

  execute({ direction }) {
    this.state.currentPlayer.moveClaw(direction);
    this.state.currentPlayer.endTurn();
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
