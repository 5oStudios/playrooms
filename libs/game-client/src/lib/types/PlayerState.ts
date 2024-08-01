// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.32
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'

export class PlayerState extends Player {
    @type("boolean") public isMyTurn!: boolean;
    @type("string") public state!: string;
    @type("number") public totalMoves!: number;
    @type("number") public totalMovesThisRound!: number;
    @type("number") public totalDrops!: number;
    @type("number") public totalWins!: number;
    @type("number") public totalLosses!: number;
    @type("number") public lastWinAt!: number;
    @type("number") public lastLossAt!: number;
    @type("number") public lastMoveAt!: number;
    @type("number") public currentTurnTimerInSeconds!: number;
    @type("number") public totalRounds!: number;
    @type("number") public queueOrder!: number;
}
