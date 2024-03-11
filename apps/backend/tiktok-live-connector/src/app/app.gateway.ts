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

export enum TikTokLiveEvents {
  ROOM_USER = 'roomUser',
  MEMBER = 'member',
  CHAT = 'chat',
  GIFT = 'gift',
  SOCIAL = 'social',
  LIKE = 'like',
  QUESTION_NEW = 'questionNew',
  LINK_MIC_BATTLE = 'linkMicBattle',
  LINK_MIC_ARMIES = 'linkMicArmies',
  LIVE_INTRO = 'liveIntro',
  EMOTE = 'emote',
  ENVELOPE = 'envelope',
  SUBSCRIBE = 'subscribe',
}
export const listenToStreamEventKey = 'listenToStream';

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
  }
}
