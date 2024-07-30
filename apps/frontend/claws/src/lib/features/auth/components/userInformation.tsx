'use client';

import { useEffect } from 'react';

import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import {
  attemptRefreshingSession,
  doesSessionExist,
  getAccessToken,
  getAccessTokenPayloadSecurely,
  getClaimValue,
  getInvalidClaimsFromResponse,
  getUserId,
  signOut,
  validateClaims,
} from 'supertokens-web-js/recipe/session';

import { useAppSelector } from '../../../hooks';
import AccessDeniedScreen from './AccessDeniedScreen';

export function UserInformation() {
  // const session = useSessionContext();
  const user = useAppSelector((state) => state.user.user);

  // if (session.loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <div>
        <p>
          Client side component got userId: {user?.emails[0]}
          <br />
        </p>
      </div>
    </div>
  );
}
