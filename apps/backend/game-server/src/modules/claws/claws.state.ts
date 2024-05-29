import { ArraySchema, Schema, type } from '@colyseus/schema';
import { ClawsPlayer } from './claws.player';

export class ClawsState extends Schema {
  @type({ array: ClawsPlayer })
  players = new ArraySchema();

  currentPlayer: ClawsPlayer | null = null;

  createPlayer() {
    const player = new ClawsPlayer();
    this.players.push(player);
    if (this.players.length === 1) {
      this.startGame();
    }
  }

  removePlayer(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (player) {
      this.players.splice(this.players.indexOf(player), 1);
    }
  }

  startGame() {
    this.currentPlayer = this.players[0];
    this.currentPlayer.startTurn({
      countDownInSeconds: 3,
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
      countDownInSeconds: 3,
      onCountDownEnd: () => {
        this.nextPlayer();
      },
    });
  }
}
