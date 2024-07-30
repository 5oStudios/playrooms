'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { SuperTokensWrapper } from 'supertokens-auth-react';
import SuperTokensReact from 'supertokens-auth-react';

import { frontendConfig, setRouter } from '../config/frontend';

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig());
  console.log('SuperTokens initialized');
}

export const SuperTokensProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  setRouter(useRouter(), usePathname() || window.location.pathname);

  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
