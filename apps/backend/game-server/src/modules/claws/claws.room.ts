import { Dispatcher } from '@colyseus/command';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client, Room } from 'colyseus';

import { CLAWS_CONFIG } from './claws.config';
import { MoveClawCommand } from './commands/move-claw.command';
import { StartGameCommand } from './commands/start-game.command';
import { PlayerState } from './state/player.state';
import { RoomState } from './state/room.state';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';
import { getInstance } from '../../main';
import { AddPlayerCommand } from './commands/room/add-player.command';

type AuthenticatedUser = {
  email: string;
  email_verified: boolean;
  name: string;
};

@Injectable()
export class ClawsRoom extends Room<RoomState> {
  static roomName = CLAWS_CONFIG.ROOM_NAME;
  maxClients = CLAWS_CONFIG.MAX_PLAYERS;
  dispatcher = new Dispatcher(this);
  static authenticatedUser: AuthenticatedUser;


  static async onAuth(token: string) {
    if (process.env.NODE_ENV === 'development') return {};

    const authService = getInstance().get(KEYCLOAK_INSTANCE);
    const user = await authService.grantManager.userInfo(token);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not authenticated',
      });
    }
    ClawsRoom.authenticatedUser = user;
    return user;
  }

  onCreate() {
    this.setState(new RoomState());
    this.onMessage('move-claw', async (client, message) => {
      this.dispatcher.dispatch(new MoveClawCommand(), {
        sessionId: client.sessionId,
        direction: message.direction,
      });
    });
  }

  onJoin(client: Client<PlayerState>) {
    this.dispatcher.dispatch(new AddPlayerCommand(), new PlayerState(client));

    if (this.state.players.length === CLAWS_CONFIG.MIN_PLAYERS_TO_START) {
      this.dispatcher.dispatch(new StartGameCommand());
    }
  }

  async onLeave(client: Client) {
    // CLAWS_CONFIG.ALLOW_RECONNECTION && await this.allowReconnection(client, CLAWS_CONFIG.RECONNECTION_TIMEOUT);
    // this.dispatcher.dispatch(new RemovePlayerCommand(), client);
    this.state.removeFromPlayers(client.sessionId);

  }
}
