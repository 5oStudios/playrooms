import { Room } from 'colyseus';

import { ClawsState } from './claws.state';

export class ClawsRoom extends Room {
  static roomName = 'claws';

  onCreate(options: unknown) {
    this.setState(new ClawsState());
  }

  onJoin(client: any, options: any) {
    this.state.createPlayer();
  }

  onLeave(client: any) {
    this.state.removePlayer(client.sessionId);
  }

  onMessage(client: any, message: any) {
    this.state.currentPlayer.moveClaws({ direction: message.direction });
  }
}
