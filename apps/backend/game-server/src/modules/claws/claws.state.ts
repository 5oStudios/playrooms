import { ArraySchema, Schema, type } from '@colyseus/schema';
import { ClawsPlayer } from './claws.player';

const PLAYER_TURN_DURATION = 3;

export class ClawsState extends Schema {
  @type({ array: ClawsPlayer })
  players = new ArraySchema<ClawsPlayer>();

  currentPlayer: ClawsPlayer | null = null;

  addPlayer(player: ClawsPlayer) {
    this.players.push(player);
    const isFirstPlayer = this.players.length === 1;
    if (isFirstPlayer) this.startGame();
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

  startGame() {
    this.currentPlayer = this.players[0];
    this.currentPlayer.startTurn({
      countDownInSeconds: PLAYER_TURN_DURATION,
      onCountDownEnd: () => {
        this.nextPlayer();
      },
    });
  }

  nextPlayer() {
    const currentPlayerIndex = this.players.indexOf(this.currentPlayer);
    this.currentPlayer = this.players[currentPlayerIndex + 1];
    if (!this.currentPlayer) {
      this.currentPlayer = this.players[0];
    }
    this.currentPlayer.startTurn({
      countDownInSeconds: PLAYER_TURN_DURATION,
      onCountDownEnd: () => {
        this.nextPlayer();
      },
    });
  }
}
