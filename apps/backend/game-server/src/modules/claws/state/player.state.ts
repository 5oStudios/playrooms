import { type } from '@colyseus/schema';
import axios from 'axios';
import { Player } from '../../player.base';
import { Client } from 'colyseus';

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

  constructor(playerInfo: Client) {
    super(playerInfo);
  }

  startTurn() {
    this.isMyTurn = true;
    this.totalRounds++;
  }

  endTurn() {
    this.currentTurnTimerInSeconds = 0;
    this.isMyTurn = false;
    this.lastMoveAt = Date.now();
  }

  async moveClaw(direction: CLAWS_DIRECTION) {
    this.state = ClawsPlayerState.MOVING;
    const { data: result } = await axios.post('https://api.mshemali.dev/control', {
      direction,
    });
    this.totalMoves++;
    this.state = ClawsPlayerState.IDLE;
    return result;
  }

  async dropClaw() {
    const result = await this.moveClaw(CLAWS_DIRECTION.DROP);
    console.log('Drop claw result: ', result);
    if (result === 'lose') {
      this.totalLosses++;
      this.lastLossAt = Date.now();
    } else {
      this.totalWins++;
      this.lastWinAt = Date.now();
    }
  }
}
