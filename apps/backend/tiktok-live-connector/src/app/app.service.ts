import { Injectable } from '@nestjs/common';
import { WebcastPushConnection } from 'tiktok-live-connector';

@Injectable()
export class AppService {
  async getData() {
    const tiktokLiveConnection = new WebcastPushConnection('@maii.salamaa');
    await tiktokLiveConnection.connect();
    tiktokLiveConnection.on('chat', (data) => {});
    // await tiktokLiveConnection.connect();
    return 'Hello World';
  }
}
