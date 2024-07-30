'use client';

import { ReactNode, useRef } from 'react';

import { Provider } from 'react-redux';
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty';

import { AppStore, makeStore } from '../lib/store';

export const Providers = ({ children }: { children: ReactNode }) => {
  SuperTokens.init({
    appInfo: {
      apiDomain: 'https://api.supertokens.com',
      apiBasePath: '/auth',
      appName: '...',
    },
    recipeList: [Session.init(), ThirdParty.init()],
  });
  return <StoreProvider>{children}</StoreProvider>;
};

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
