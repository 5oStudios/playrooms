// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.32
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { PlayerState } from './PlayerState'
import { MachineState } from './MachineState'

export class RoomState extends Schema {
    @type([ PlayerState ]) public players: ArraySchema<PlayerState> = new ArraySchema<PlayerState>();
    @type(PlayerState) public currentPlayer: PlayerState = new PlayerState();
    @type("string") public gameState!: string;
    @type(MachineState) public machine: MachineState = new MachineState();
    @type("string") public streamUrl!: string;
    @type("number") public startedAt!: number;
    @type([ PlayerState ]) public removedPlayers: ArraySchema<PlayerState> = new ArraySchema<PlayerState>();
}
