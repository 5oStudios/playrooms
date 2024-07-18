import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';

import { CLAWS_CONFIG } from './claws.config';
import { ClawsPlayer } from './claws.player';
import { ClawsState } from './claws.state';
import { MoveClawCommand, StartGameCommand } from './commands';

export class ClawsRoom extends Room<ClawsState> {
  static roomName = CLAWS_CONFIG.ROOM_NAME;
  maxClients = CLAWS_CONFIG.MAX_PLAYERS;
  dispatcher = new Dispatcher(this);

  onCreate() {
    this.setState(new ClawsState());
    this.onMessage('move-claw', async (client, message) => {
      this.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: client.sessionId,
        direction: message.direction,
      });
    });
  }

  onJoin(client: Client) {
    this.state.addPlayer(new ClawsPlayer({ sessionId: client.sessionId }));

    if (this.state.players.length === CLAWS_CONFIG.MIN_PLAYERS_TO_START) {
      this.dispatcher.dispatch(new StartGameCommand());
    }
  }

  onLeave(client: Client) {
    this.state.removePlayerBySessionId(client.sessionId);
  }
}
