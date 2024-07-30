import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import supertokens, { User } from 'supertokens-node';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from './auth.guard';
import { Session } from './session/session.decorator';

@Controller('auth')
export class AuthController {
  @Get('userinfo')
  @UseGuards(new AuthGuard())
  async getUserInfo(@Session() session: SessionContainer): Promise<User> {
    const userId = session.getUserId();
    const userInfo = await supertokens.getUser(userId);
    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }
    return userInfo;
  }
}
