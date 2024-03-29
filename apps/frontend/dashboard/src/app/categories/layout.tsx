import React from 'react';

import { ThemedLayout } from '@components/themed-layout';
import { authProviderServer } from '@providers/auth-provider';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || '/login');
  }

  return <ThemedLayout>{children}</ThemedLayout>;
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();
  console.log(authenticated, redirectTo);

  return {
    authenticated,
    redirectTo,
  };
}
