'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { redirectToAuth } from 'supertokens-auth-react';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdparty';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

import Auth from '../../lib/features/auth/components/auth';

export default function AuthPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!SuperTokens.canHandleRoute([ThirdPartyPreBuiltUI])) {
      redirectToAuth({ redirectBack: false });
    } else {
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    return SuperTokens.getRoutingComponent([ThirdPartyPreBuiltUI]);
  }

  return null;
}
