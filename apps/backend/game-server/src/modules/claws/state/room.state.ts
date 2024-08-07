import { ArraySchema, Schema, type } from '@colyseus/schema';
import { PlayerState } from './player.state';
import { MachineState } from './machine.state';
import { QueueSchema } from '../../../queue';

export enum GAME_STATE {
  WAITING = 'waiting',
  CHOOSING = 'choosing',
  STARTED = 'started',
  ENDED = 'ended',
}

export class RoomState extends Schema {
  @type({ array: PlayerState })
  players = new QueueSchema<PlayerState>();

  @type(PlayerState)
  currentPlayer: PlayerState | null = null;

  @type('string')
  gameState: GAME_STATE = GAME_STATE.WAITING;

  @type(MachineState)
  machine: MachineState = new MachineState();

  @type('string')
  streamUrl = '';

  @type('number')
  startedAt = 0;

  @type({ array: PlayerState })
  removedPlayers: PlayerState[] = new ArraySchema<PlayerState>();

  constructor(roomState: Partial<RoomState> = {}) {
    super();
    Object.assign(this, roomState);
  }

  existsInPlayers(email: string) {
    return this.players.some((p) => p.email === email);
  }

  existsInRemovedPlayers(email: string) {
    return this.removedPlayers.some((p) => p.email === email);
  }

  removeFromPlayers(sessionId: string) {
    const player = this.players.find((p) => p.sessionId === sessionId);
    if (player) {
      this.players.splice(this.players.indexOf(player), 1);
      this.removedPlayers.push(player);
    }
  }

  removeFromRemovedPlayers(sessionId: string) {
    const player = this.removedPlayers.find((p) => p.sessionId === sessionId);
    if (player) {
      this.removedPlayers.splice(this.removedPlayers.indexOf(player), 1);
    }
  }
}
