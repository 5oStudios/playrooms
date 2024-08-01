import { type } from '@colyseus/schema';
import axios from 'axios';
import { Client } from 'colyseus';

import { Player } from '../../player.base';
import { CLAWS_CONFIG } from '../claws.config';

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
  totalMovesThisRound = 0;

  @type('number')
  totalDrops = 0;

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
  currentTurnTimerInSeconds = CLAWS_CONFIG.PLAYER_TURN_DURATION / 1000;

  @type('number')
  totalRounds = 0;

  @type('number')
  queueOrder = 0;

  constructor(playerInfo: Client) {
    super(playerInfo);
  }

  startTurn() {
    this.isMyTurn = true;
    this.totalMovesThisRound = 0;
    this.totalRounds++;
    this.currentTurnTimerInSeconds = CLAWS_CONFIG.PLAYER_TURN_DURATION / 1000;
  }

  endTurn() {
    console.log('Ending turn of ' + this.name);
    this.isMyTurn = false;
    this.currentTurnTimerInSeconds = 0;
  }

  async moveClaw(direction: CLAWS_DIRECTION) {
    this.state = ClawsPlayerState.MOVING;
    try {
      const { data: result } = await axios.post(
        'https://api.mshemali.dev/control',
        {
          direction,
        },
      );
      this.totalMoves++;
      this.totalMovesThisRound++;
      this.state = ClawsPlayerState.IDLE;
      this.lastMoveAt = Date.now();
      return result;
    } catch (error) {
      console.error('Failed to move claw', error);
      this.state = ClawsPlayerState.IDLE;
      return 'lose';
    }
  }

  async dropClaw() {
    const result = await this.moveClaw(CLAWS_DIRECTION.DROP);
    this.totalDrops++;
    if (result === 'lose') {
      this.totalLosses++;
      this.lastLossAt = Date.now();
    } else {
      this.totalWins++;
      this.lastWinAt = Date.now();
    }

    return result;
  }
}
