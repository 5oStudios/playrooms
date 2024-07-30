'use client';

import { useEffect, useState } from 'react';

import { redirectToAuth } from 'supertokens-auth-react';
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

export default function Auth() {
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
