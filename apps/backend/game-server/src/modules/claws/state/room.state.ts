import { ArraySchema, Schema, type } from '@colyseus/schema';
import { PlayerState } from './player.state';
import { MachineState } from './machine.state';

export enum GAME_STATE {
  WAITING = 'waiting',
  STARTED = 'started',
  ENDED = 'ended',
}

export class RoomState extends Schema {
  @type({ array: PlayerState })
  players = new ArraySchema<PlayerState>();

  @type(PlayerState)
  currentPlayer: PlayerState | null = null;

  @type('string')
  gameState: GAME_STATE = GAME_STATE.WAITING;

  @type(MachineState)
  machine: MachineState = new MachineState();

  @type('number')
  startedAt: number = 0;

  addPlayer(player: PlayerState) {
    this.players.push(player);
  }

  removePlayer(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (player) {
      this.players.splice(this.players.indexOf(player), 1);
    }
  }

  removePlayerBySessionId(sessionId: string) {
    const player = this.players.find((p) => p.sessionId === sessionId);
    if (player) {
      this.players.splice(this.players.indexOf(player), 1);
    }
  }
}
