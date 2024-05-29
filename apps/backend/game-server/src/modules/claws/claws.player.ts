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

  private timerInterval?: NodeJS.Timeout;

  startTurn({
              countDownInSeconds = 0,
              onCountDownEnd,
            }: {
    countDownInSeconds?: number;
    onCountDownEnd?: () => void;
  }) {
    this.currentTurnTimerInSeconds = 0;

    this.timerInterval = setInterval(() => {
      this.currentTurnTimerInSeconds++;
      if (this.currentTurnTimerInSeconds >= countDownInSeconds) {
        this.endTurn();
        if (onCountDownEnd) {
          onCountDownEnd();
        }
      }
    }, 1000);

    this.isMyTurn = true;
    this.totalRounds++;
  }

  endTurn() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.lastMoveAt = Date.now();
    this.currentTurnTimerInSeconds = 0;
    this.isMyTurn = false;
  }
}
