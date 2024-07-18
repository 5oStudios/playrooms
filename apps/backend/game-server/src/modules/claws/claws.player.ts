import { type } from '@colyseus/schema';
import { Player } from '../player.base';

export class ClawsPlayer extends Player {
  @type('boolean')
  isMyTurn = false;

  @type('number')
  totalMoves = 0;

  @type('number')
  totalWins = 0;

  @type('number')
  totalLosses = 0;

  @type('number')
  lastWinAt = 0;

  @type('number')
  lastLossAt = 0;

  @type('number')
  lastMoveAt = 0;

  @type('number')
  currentTurnTimerInSeconds = 0;

  @type('number')
  totalRounds = 0;

  constructor(playerInfo: Partial<Player>) {
    super(playerInfo);
  }

  startTurn(){
    this.isMyTurn = true;
    this.totalRounds++
  }

  endTurn() {
    this.currentTurnTimerInSeconds = 0;
    this.isMyTurn = false;
    this.lastMoveAt = Date.now();
  }

  moveClaw(direction: 'down' | 'left' | 'right') {
    this.totalMoves++;
  }
}
