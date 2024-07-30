import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  VerifySessionOptions,
  getSession,
} from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly getSessionOptions?: VerifySessionOptions) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest();
    const resp = ctx.getResponse();

    // If the session doesn't exist and {sessionRequired: true} is passed to the AuthGuard constructor (default is true),
    // getSession will throw an error, that will be handled by the exception filter, returning a 401 response.

    // To avoid an error when the session doesn't exist, pass {sessionRequired: false} to the AuthGuard constructor.
    // In this case, req.session will be undefined if the session doesn't exist.
    req.session = await getSession(req, resp, this.getSessionOptions);
    return true;
  }
}
