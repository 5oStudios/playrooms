import { Injectable, Logger } from '@nestjs/common';
import { WebcastPushConnection } from 'tiktok-live-connector';

@Injectable()
export class AppService {
  listener: WebcastPushConnection;
  constructor(private readonly logger: Logger) {}
  async tiktokLiveConnection(username: string) {
    this.logger.warn(`Connecting to user ${username}`);
    const listener = new WebcastPushConnection(username);
    listener
      .connect()
      .then(() => {
        this.logger.log(`Connected to user ${username}`);
      })
      .catch((err: unknown) => {
        this.logger.error(`Connection failed, ${err}`);
      });
    return listener;
  }
}
