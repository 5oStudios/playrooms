import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WebcastPushConnection } from 'tiktok-live-connector';

@WebSocketGateway()
export class AppGateway {
  @SubscribeMessage('chat')
  async onChat(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket
  ) {
    const tiktokLiveConnection = new WebcastPushConnection('@' + username);
    tiktokLiveConnection
      .connect()
      .then(() => {
        console.log('Connected to TikTok Live: ' + username);
        client.emit('chat', 'Connected to TikTok Live: ' + username);
      })
      .catch((error) => {
        console.error('Error connecting to TikTok Live: ' + username);
        console.error(error);
        client.emit('chat', 'Error connecting to TikTok Live: ' + username);
      });
    tiktokLiveConnection.on('chat', (data) => {
      console.log('received chat message');
      client.emit('chat', data);
    });
  }
}

async function socketSendToClient(data: any) {
  return data;
}
