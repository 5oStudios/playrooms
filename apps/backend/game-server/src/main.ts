/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { playground } from '@colyseus/playground';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Server } from 'colyseus';

import { AppModule } from './app/app.module';
import { ClawsRoom } from './modules/claws/claws.room';

const rooms = [ClawsRoom];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const server = app.getHttpServer();
  const gameServer = new Server({
    transport: new WebSocketTransport({
      server,
    }),
  });

  rooms.forEach((room) => {
    gameServer.define(room.roomName, room);
  });

  // await gameServer.listen(3001);
  Logger.log(`🎮 Game server is running on ws://localhost:3001`);

  app.use('/playground', playground);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
