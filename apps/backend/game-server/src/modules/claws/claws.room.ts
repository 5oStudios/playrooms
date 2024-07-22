import { Dispatcher } from '@colyseus/command';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client, Room } from 'colyseus';

import { CLAWS_CONFIG } from './claws.config';
import { MoveClawCommand } from './commands/move-claw.command';
import { StartGameCommand } from './commands/start-game.command';
import { PlayerState } from './state/player.state';
import { RoomState } from './state/room.state';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';
import { Promise } from 'cypress/types/cy-bluebird';
import { getInstance } from '../../main';

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

  onJoin(client: Client) {
    this.state.addPlayer(new PlayerState({
      sessionId: client.sessionId,
      email: ClawsRoom.authenticatedUser.email,
      name: ClawsRoom.authenticatedUser.name,
    }));

    if (this.state.players.length === CLAWS_CONFIG.MIN_PLAYERS_TO_START) {
      this.dispatcher.dispatch(new StartGameCommand());
    }
  }

  onLeave(client: Client) {
    this.state.removePlayerBySessionId(client.sessionId);
  }

  onDispose(): void | Promise<any> {
    console.log('Room disposed');
    super.onDispose();
  }
}
