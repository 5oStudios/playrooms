import { Injectable, Logger } from '@nestjs/common';
import { WebcastPushConnection } from 'tiktok-live-connector';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  async tiktokLiveConnection(username: string) {
    const tiktokLiveConnection = new WebcastPushConnection('@' + username);
    tiktokLiveConnection
      .connect()
      .then((state: any) => {
        this.logger.log(
          `Connected to roomId ${state.roomId}, websocket: ${state.upgradedToWebsocket}`
        );
      })
      .catch((err: any) => {
        this.logger.error(`Connection failed, ${err}`);
      });

    return tiktokLiveConnection;
  }
}
