import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AsyncApiPub } from 'nestjs-asyncapi';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { tiktokEvents } from './events-handlers';
import { listenToStreamEventKey } from '@core/tiktok-client';

@WebSocketGateway({ cors: true })
export class AppGateway {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}
  @SubscribeMessage(listenToStreamEventKey)
  @AsyncApiPub({
    description: 'Listen to TikTok Live stream',
    channel: 'listenToStream',
    message: {
      payload: String,
    },
  })
  async listenToStream(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket
  ) {
    const connection = await this.appService.tiktokLiveConnection(username);
    tiktokEvents.forEach(({ key, handler }) => {
      connection.on(key, (data) => {
        client.emit(key, handler(data));
        this.logger.log(`received event: ${key} from streamer: ${username}`);
      });
    });

    client.on('connect', () => {
      this.logger.log(`connected to streamer: ${username}`);
    });

    client.on('disconnect', () => {
      connection.disconnect();
      this.logger.log(`disconnected from streamer: ${username}`);
    });
  }
}
