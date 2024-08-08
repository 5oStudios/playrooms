import { Schema, type } from '@colyseus/schema';

export enum MACHINE_STATE {
  IDLE = 'idle',
  MOVING = 'moving',
  DROPPING = 'dropping',
}

export enum GAME_STATE {
  WAITING = 'waiting',
  CHOOSING = 'choosing',
  STARTED = 'started',
  ENDED = 'ended',
}

export enum PLAYER_STATE {
  IDLE = 'idle',
  MOVING = 'moving',
}

export class MachineState extends Schema {
  @type('string')
  state: MACHINE_STATE = MACHINE_STATE.IDLE;
}
