'use client';

import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import AccessDeniedScreen from './AccessDeniedScreen';

export function UserInformation() {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (!session.doesSessionExist) {
    return <div>Session does not exist</div>;
  }

  return (
    <div>
      <div>
        <p>
          Client side component got userId: {session.userId}
          <br />
        </p>
      </div>
    </div>
  );
}
