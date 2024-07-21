import { Schema, type } from '@colyseus/schema';

export enum MACHINE_STATE {
  IDLE = 'idle',
  MOVING = 'moving',
  DROPPING = 'dropping',
}

export class MachineState extends Schema {
  @type('string')
  state: MACHINE_STATE = MACHINE_STATE.IDLE;
}
