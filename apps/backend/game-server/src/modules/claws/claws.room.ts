import { Dispatcher } from '@colyseus/command';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Delayed, Room, matchMaker } from 'colyseus';

import { CLAWS_CONFIG } from './claws.config';
import { SelectNextPlayerCommand } from './commands/next-player.command';
import { MoveClawCommand } from './commands/player/move-claw.command';
import { AddPlayerCommand } from './commands/room/add-player.command';
import { StartGameCommand } from './commands/start-game.command';
import { StartPlayerTurnCommand } from './commands/start-turn.command';
import { PlayerState } from './state/player.state';
import { RoomState } from './state/room.state';

type AuthenticatedUser = {
  email: string;
  email_verified: boolean;
  name: string;
};

@Injectable()
export class ClawsRoom extends Room<RoomState> implements OnModuleInit {
  static roomName = CLAWS_CONFIG.ROOM_NAME;
  maxClients = CLAWS_CONFIG.MAX_PLAYERS;
  // @ts-ignore
  autoDispose = false;
  dispatcher = new Dispatcher(this);
  static authenticatedUser: AuthenticatedUser;
  timers: Map<
    {
      sessionId: string;
      timerKey?: string;
    },
    Delayed
  > = new Map();

  static async onAuth(token: string, req: any) {
    // if (process.env.NODE_ENV === 'development') return {};

    console.log('session', req.session);

    // const authService = getInstance().get(KEYCLOAK_INSTANCE);
    // const user = await authService.grantManager.userInfo(token);
    // if (!user) {
    //   throw new UnauthorizedException({
    //     message: 'User not authenticated',
    //   });
    // }
    // ClawsRoom.authenticatedUser = user;
    // return user;
  }

  async onCreate({ streamUrl }: { streamUrl: string }) {
    if (!streamUrl) throw new Error('Stream URL is required');

    this.setState(new RoomState({ streamUrl }));
    await this.setMetadata({ streamUrl });
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
    this.timers
      .get({
        sessionId: client.sessionId,
      })
      ?.clear();

    if (this.state.currentPlayer?.sessionId === client.sessionId) {
      this.dispatcher.dispatch(new SelectNextPlayerCommand());
      await this.dispatcher.dispatch(new StartPlayerTurnCommand());
    }
  }

  async onModuleInit() {
    const availableStreams = ['https://cam.mshemali.dev'];
    for (const index in availableStreams) {
      await matchMaker.createRoom(ClawsRoom.roomName, {
        streamUrl: availableStreams[index],
      });
    }
  }
}
