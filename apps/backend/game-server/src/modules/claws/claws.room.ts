import { Client, Room } from 'colyseus';

import { ClawsPlayer } from './claws.player';
import { ClawsState } from './claws.state';

export class ClawsRoom extends Room<ClawsState> {
  static roomName = 'claws';

  onCreate(options: unknown) {
    this.setState(new ClawsState());
  }

  onJoin(client: Client) {
    const newPlayer = new ClawsPlayer();
    newPlayer.sessionId = client.sessionId;
    this.state.addPlayer(newPlayer);
  }

  onLeave(client: Client) {
    this.state.removePlayerBySessionId(client.sessionId);
  }
}
