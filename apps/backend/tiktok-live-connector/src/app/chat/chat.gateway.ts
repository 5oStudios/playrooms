import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageDto } from './message.dto';
import { AsyncApiSub } from 'nestjs-asyncapi';

enum tiktokEvents {
  chat = 'chat',
}

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly logger: Logger
  ) {}
  @SubscribeMessage(tiktokEvents.chat)
  @AsyncApiSub({
    description: 'Chat messages from TikTok Live',
    channel: 'chat',
    message: {
      payload: MessageDto,
    },
  })
  async onChat(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket
  ) {
    this.chatService.tiktokLiveConnection(username).then((connection) => {
      connection.on(tiktokEvents.chat, (data) => {
        const message = new MessageDto(data);
        client.emit(tiktokEvents.chat, message);
        this.logger.log('received chat message from', message.nickname);
      });
    });
  }
}
