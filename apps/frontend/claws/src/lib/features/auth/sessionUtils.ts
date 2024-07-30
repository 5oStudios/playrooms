import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  CollectingResponse,
  PreParsedRequest,
} from 'supertokens-node/framework/custom';
import Session, {
  SessionContainer,
  VerifySessionOptions,
} from 'supertokens-node/recipe/session';
import { HTTPMethod } from 'supertokens-node/types';

export async function getSSRSession(
  req?: NextRequest,
  options?: VerifySessionOptions,
): Promise<{
  session: SessionContainer | undefined;
  hasToken: boolean;
  hasInvalidClaims: boolean;
  baseResponse: CollectingResponse;
  nextResponse?: NextResponse;
}> {
  const query =
    req !== undefined
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : {};
  const parsedCookies: Record<string, string> = Object.fromEntries(
    (req !== undefined ? req.cookies : cookies())
      .getAll()
      .map((cookie) => [cookie.name, cookie.value]),
  );
  let baseRequest = new PreParsedRequest({
    method: req !== undefined ? (req.method as HTTPMethod) : 'get',
    url: req !== undefined ? req.url : '',
    query: query,
    headers: req !== undefined ? req.headers : headers(),
    cookies: parsedCookies,
    getFormBody: () => req!.formData(),
    getJSONBody: () => req!.json(),
  });

  let baseResponse = new CollectingResponse();

  try {
    let session = await Session.getSession(baseRequest, baseResponse, options);
    return {
      session,
      hasInvalidClaims: false,
      hasToken: session !== undefined,
      baseResponse,
    };
  } catch (err) {
    if (Session.Error.isErrorFromSuperTokens(err)) {
      return {
        hasToken: err.type !== Session.Error.UNAUTHORISED,
        hasInvalidClaims: err.type === Session.Error.INVALID_CLAIMS,
        session: undefined,
        baseResponse,
        nextResponse: new NextResponse('Authentication required', {
          status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
        }),
      };
    } else {
      throw err;
    }
  }
}
