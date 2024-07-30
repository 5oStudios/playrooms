import { Controller, Get, UseGuards } from '@nestjs/common';
// ...
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from '../modules/auth/auth.guard';
import { Session } from '../modules/auth/session/session.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  @UseGuards(new AuthGuard())
  getData(@Session() session: SessionContainer) {
    console.log('Session handle: ', session.getHandle());

    return {
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      accessTokenPayload: session.getAccessTokenPayload(),
    };
  }
}
