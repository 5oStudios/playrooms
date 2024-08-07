'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import SuperTokens from 'supertokens-auth-react';
import Session from 'supertokens-auth-react/recipe/session';

export const TryRefreshComponent = () => {
  const router = useRouter();
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    void Session.attemptRefreshingSession()
      .then((hasSession) => {
        if (hasSession) {
          router.refresh();
        } else {
          SuperTokens.redirectToAuth();
        }
      })
      .catch(() => {
        setDidError(true);
      });
  }, []);

  if (didError) {
    return <div>Something went wrong, please reload the page</div>;
  }

  return <div>Loading...</div>;
};
