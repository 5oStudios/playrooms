/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { playground } from '@colyseus/playground';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Server, matchMaker } from 'colyseus';
import supertokens from 'supertokens-node';

import { AppModule } from './app/app.module';
import { SupertokensExceptionFilter } from './modules/auth/auth.filter';
import { ClawsRoom } from './modules/claws/claws.room';

const rooms = [ClawsRoom];
let app: INestApplication;
export const getInstance = () => app;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: 'http://localhost:3001',
    allowedHeaders: [...supertokens.getAllCORSHeaders(), 'content-type'],
    credentials: true,
  });

  matchMaker.controller.getCorsHeaders = function (req) {
    return {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      Vary: '*',
      'Access-Control-Allow-Headers': [
        'content-type',
        supertokens.getAllCORSHeaders(),
      ].join(', '),
    };
  };

  const server = app.getHttpServer();

  const gameServer = new Server({
    transport: new WebSocketTransport({
      server,
    }),
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  rooms.forEach((room) => {
    gameServer.define(room.roomName, room);
  });

  Logger.log(`🎮 Game server is running on ws://localhost:${port}`);

  app.use('/playground', playground);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
