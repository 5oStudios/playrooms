import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';

import { CLAWS_CONFIG } from './claws.config';
import { MoveClawCommand, StartGameCommand } from './commands';
import { PlayerState } from './state/player.state';
import { RoomState } from './state/room.state';

export class ClawsRoom extends Room<RoomState> {
  static roomName = CLAWS_CONFIG.ROOM_NAME;
  maxClients = CLAWS_CONFIG.MAX_PLAYERS;
  dispatcher = new Dispatcher(this);

  onCreate() {
    this.setState(new RoomState());
    this.onMessage('move-claw', async (client, message) => {
      this.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: client.sessionId,
        direction: message.direction,
      });
    });
  }

  onJoin(client: Client) {
    this.state.addPlayer(new PlayerState({ sessionId: client.sessionId }));

    if (this.state.players.length === CLAWS_CONFIG.MIN_PLAYERS_TO_START) {
      this.dispatcher.dispatch(new StartGameCommand());
    }
  }

  onLeave(client: Client) {
    this.state.removePlayerBySessionId(client.sessionId);
  }
}
