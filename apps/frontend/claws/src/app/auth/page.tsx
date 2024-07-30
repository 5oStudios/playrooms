'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-auth-react/recipe/thirdparty';

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
      frontendRedirectURI: 'http://localhost:3001/rooms',
      thirdPartyId,
    });
    router.push(authURL);
  };

  return (
    <button
      type="submit"
      className="w-full px-5 py-2 text-xl bg-white border-2 rounded-md shadow text-zinc-700 border-zinc-700"
      onClick={() => authButtonClicked(thirdPartyId)}
    >
      <div className="flex flex-row w-3/4 mx-auto">
        <img
          src={`/logos/${thirdPartyId.toLowerCase()}.svg`}
          alt="Github Logo"
          className="w-auto h-6 my-auto mr-4"
        />
        <p className="mx-auto">Continue with {thirdPartyId}</p>
      </div>
    </button>
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
