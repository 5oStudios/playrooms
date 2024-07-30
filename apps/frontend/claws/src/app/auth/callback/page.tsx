'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { signInAndUp } from 'supertokens-auth-react/recipe/thirdparty';

export default function CallbackPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function handleGoogleCallback() {
      try {
        const response = await signInAndUp();

        if (response.status === 'OK') {
          if (
            response.createdNewRecipeUser &&
            response.user.loginMethods.length === 1
          ) {
            // sign up successful
          } else {
            // sign in successful
          }
          router.push('/');
        } else if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
          // the reason string is a user friendly message
          // about what went wrong. It can also contain a support code which users
          // can tell you so you know why their sign in / up was not allowed.
          window.alert(response.reason);
          router.push('/auth');
        } else {
          // SuperTokens requires that the third party provider
          // gives an email for the user. If that's not the case, sign up / in
          // will fail.

          // As a hack to solve this, you can override the backend functions to create a fake email for the user.

          window.alert(
            'No email provided by social login. Please use another form of login',
          );
          router.push('/auth'); // redirect back to login page
        }
      } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
          // this may be a custom error message sent from the API by you.
          console.error(err.message);
        } else {
          console.error('Oops! Something went wrong.', err);
        }
      } finally {
        setLoading(false);
      }
    }

    handleGoogleCallback();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }
}
