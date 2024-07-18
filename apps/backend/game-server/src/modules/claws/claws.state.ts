import { ArraySchema, Schema, type } from '@colyseus/schema';
import { ClawsPlayer } from './claws.player';


export class ClawsState extends Schema {
  @type({ array: ClawsPlayer })
  players = new ArraySchema<ClawsPlayer>();

  @type(ClawsPlayer)
  currentPlayer: ClawsPlayer | null = null;

  @type('string')
  gameState: 'started' | 'ended' | 'waiting' = 'waiting';

  @type('number')
  startedAt: number = 0;

  addPlayer(player: ClawsPlayer) {
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

  // nextPlayer() {
  //   const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
  //   this.currentPlayer = this.players[currentPlayerIndex + 1];
  //   if (!this.currentPlayer) {
  //     this.currentPlayer = this.players[0];
  //   }
  //   this.currentPlayer.startTurn({
  //     countDownInSeconds: CLAWS_CONFIG.PLAYER_TURN_DURATION,
  //     onCountDownEnd: () => {
  //       this.nextPlayer();
  //     },
  //   });
  // }
}
