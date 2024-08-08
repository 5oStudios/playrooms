'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdparty';

import { envSchema } from '../../env';

export default function Auth() {
  return (
    <div>
      <h1>Auth Page</h1>
      <AuthButton thirdPartyId="google" />
    </div>
  );
}

const AuthButton = ({ thirdPartyId }: { thirdPartyId: string }) => {
  const router = useRouter();

  const authButtonClicked = async (thirdPartyId: string) => {
    const authURL = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId,
      frontendRedirectURI: envSchema.NEXT_PUBLIC_FRONTEND_REDIRECT_URI,
    });
    router.push(authURL);
  };

  const providers = ['google', 'apple', 'github'];

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {providers.map((provider) => (
        <button
          style={{
            border: '1px solid black',
          }}
          key={provider}
          onClick={() => authButtonClicked(provider)}
        >
          Sign in with {provider}
        </button>
      ))}
    </div>
  );
};

// 'use client';
//
// import { useEffect, useState } from 'react';
//
// import { redirectToAuth } from 'supertokens-auth-react';
// import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
// import SuperTokens from 'supertokens-auth-react/ui';
//
// export default function Auth() {
//   // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
//   const [loaded, setLoaded] = useState(false);
//   useEffect(() => {
//     if (!SuperTokens.canHandleRoute([ThirdPartyPreBuiltUI])) {
//       redirectToAuth({ redirectBack: false });
//     } else {
//       setLoaded(true);
//     }
//   }, []);
//
//   if (loaded) {
//     return SuperTokens.getRoutingComponent([ThirdPartyPreBuiltUI]);
//   }
//
//   return null;
// }
