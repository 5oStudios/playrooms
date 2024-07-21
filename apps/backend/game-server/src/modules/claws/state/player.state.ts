import { type } from '@colyseus/schema';
import axios from 'axios';
import { Player } from '../../player.base';

export enum CLAWS_DIRECTION {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  DROP = 'drop',
}

export enum ClawsPlayerState {
  IDLE = 'idle',
  MOVING = 'moving',
}

export class PlayerState extends Player {
  @type('boolean')
  isMyTurn = false;

  @type('string')
  state: ClawsPlayerState = ClawsPlayerState.IDLE;

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

  async moveClaw(direction: CLAWS_DIRECTION) {
    this.state = ClawsPlayerState.MOVING;
    await axios.post('https://api.mshemali.dev/control', {
      direction,
    });
    this.totalMoves++;
    this.state = ClawsPlayerState.IDLE;
  }
}
